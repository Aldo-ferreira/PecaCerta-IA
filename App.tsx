
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { identifyPartFromImage } from './services/geminiService';
import type { PartIdentificationResult } from './types';

function App(): React.ReactElement {
  const [partData, setPartData] = useState<PartIdentificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:image/...;base64,
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setPartData(null);
    setImagePreviewUrl(URL.createObjectURL(file));

    try {
      const base64Image = await fileToBase64(file);
      const result = await identifyPartFromImage(base64Image);
      setPartData(result);
    } catch (err) {
      console.error(err);
      setError('Falha ao identificar a peça. A IA pode estar sobrecarregada ou a imagem não é clara. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center">
      <Header />
      <main className="w-full max-w-4xl mx-auto p-4 md:p-8 flex-grow">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-2">Identificador de Peças com IA</h2>
          <p className="text-center text-gray-400 mb-6">Fotografe uma peça elétrica ou mecânica para identificá-la, encontrar equivalentes e comparar preços.</p>
          
          <ImageUploader onImageUpload={handleImageUpload} isProcessing={isLoading} />

          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center">
              <Spinner />
              <p className="mt-4 text-lg text-cyan-300 animate-pulse">Analisando imagem... A IA está trabalhando.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
              <p className="font-bold">Ocorreu um Erro</p>
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {partData && !isLoading && (
          <div className="mt-8 bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
             <ResultsDisplay data={partData} imagePreviewUrl={imagePreviewUrl} />
          </div>
        )}
      </main>
      <footer className="w-full text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PeçaCerta. Potencializado por IA.</p>
      </footer>
    </div>
  );
}

export default App;

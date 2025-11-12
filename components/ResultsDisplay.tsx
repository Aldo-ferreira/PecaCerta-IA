import React from 'react';
import type { PartIdentificationResult } from '../types';

interface ResultsDisplayProps {
  data: PartIdentificationResult;
  imagePreviewUrl: string | null;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="text-yellow-400">★</span>)}
        {halfStar && <span className="text-yellow-400">★</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-600">★</span>)}
      </div>
    );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, imagePreviewUrl }) => {
  const { identifiedPart, equivalentParts, marketplaceListings } = data;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {imagePreviewUrl && (
            <div className="md:col-span-1">
                <img src={imagePreviewUrl} alt="Peça analisada" className="rounded-lg shadow-lg w-full h-auto object-cover" />
            </div>
        )}
        <div className={imagePreviewUrl ? "md:col-span-2" : "md:col-span-3"}>
            <h3 className="text-2xl font-bold text-cyan-400 border-b-2 border-cyan-700 pb-2 mb-4">Peça Identificada</h3>
            <h4 className="text-xl font-semibold text-white">{identifiedPart.partName}</h4>
            <p className="text-gray-300 mt-2">{identifiedPart.description}</p>
        
            <div className="mt-6">
                <h5 className="font-bold text-lg text-gray-200 mb-3">Especificações Técnicas</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {identifiedPart.specifications.map((spec, index) => (
                    <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-sm text-cyan-300 font-semibold">{spec.key}</p>
                    <p className="text-lg text-white font-mono">{spec.value}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-cyan-400 border-b-2 border-cyan-700 pb-2 mb-4">Equivalentes e Compatíveis</h3>
        <div className="flex flex-wrap gap-3">
          {equivalentParts.map((part, index) => (
            <span key={index} className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm font-medium">
              {part}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-cyan-400 border-b-2 border-cyan-700 pb-2 mb-4">Comparador de Preços (Estimativa)</h3>
        
        {/* Tabela para telas médias e maiores */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left table-auto">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th className="p-3 text-sm font-semibold tracking-wide">Vendedor</th>
                        <th className="p-3 text-sm font-semibold tracking-wide">Preço (BRL)</th>
                        <th className="p-3 text-sm font-semibold tracking-wide">Prazo de Entrega</th>
                        <th className="p-3 text-sm font-semibold tracking-wide">Avaliação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {marketplaceListings.map((listing, index) => (
                    <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                        <td className="p-3 text-white">{listing.seller}</td>
                        <td className="p-3 text-white font-mono">R$ {listing.priceBRL.toFixed(2)}</td>
                        <td className="p-3 text-white">{listing.shippingTime}</td>
                        <td className="p-3">
                            <StarRating rating={listing.rating} />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Cartões para telas pequenas (mobile) */}
        <div className="md:hidden space-y-4">
            {marketplaceListings.map((listing, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-white text-lg">{listing.seller}</h5>
                        <p className="font-mono text-cyan-400 text-lg">R$ {listing.priceBRL.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-300">
                        <p>
                            <span className="font-semibold">Entrega:</span> {listing.shippingTime}
                        </p>
                        <StarRating rating={listing.rating} />
                    </div>
                </div>
            ))}
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">Os preços e a disponibilidade são estimativas geradas por IA e podem não ser precisos.</p>
      </div>
    </div>
  );
};
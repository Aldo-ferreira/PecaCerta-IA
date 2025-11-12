
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-cyan-400">Peça</span>Certa
        </h1>
      </div>
    </header>
  );
};

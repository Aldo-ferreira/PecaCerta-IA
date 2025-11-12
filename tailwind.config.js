

export default {
  content: [
    "./index.html",
    // Esta linha verifica todos os arquivos JS/TS/JSX/TSX em todas as pastas
    // e na raiz do seu projeto (./**/*.{...})
    "./**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

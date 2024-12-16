// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#303030", // 원하는 배경색 추가
      },
    },
  },
  plugins: [],
};
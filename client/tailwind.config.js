const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar'), /*This was used because it makes the scroller beautiful (scrollbar-track-slate-700) and(scrollbar-thumb-slate-500) these 2 will not work without the tailwind-scrollbar inside DashUser.jsx*/

    // require('@tailwindcss/line-clamp'), In the new version of tailwind css we dont need this. It is inbuilt (line-clamp-2) It is used to cut the line and make even no of line in this case 2 used in PostCard.jsx
  ],
}
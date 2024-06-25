/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
	"./src/**/*.{html,ts}",
 ],
 theme: {
	extend: {},
 },
 daisyui: {
	themes: [
	 {
		mytheme: {

		 "primary": "#1D3557",

		 "secondary": "#457B9D",

		 "accent": "#E63946",

		 "neutral": "#FFFFFF",

		 "base-100": "#ffffff",

		 "info": "#A8DADC",

		 "success": "#00ff00",

		 "warning": "#00ff00",

		 "error": "#E63946",

		 "primary-content": "#ffffff"
		},
	 },
	],
 },
 plugins: [
	require('daisyui')
 ]
}


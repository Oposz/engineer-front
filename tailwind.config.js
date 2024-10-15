/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
	"./src/**/*.{html,ts}",
 ],
 theme: {
	extend: {},
	colors:{
	 'disabled': '#DEDEDEFF',
	 'disabled-text': '#BAB2B4FF'
	}
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

		 "info": "#a8dadc",

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


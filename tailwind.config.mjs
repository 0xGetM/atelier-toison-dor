/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        lin:              '#E8DFD0',
        terracotta:       '#C27044',
        creme:            '#FAFAF7',
        anthracite:       '#2D2D2D',
        'terracotta-dark':'#A85C30',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.anthracite'),
            fontFamily: theme('fontFamily.sans').join(', '),
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

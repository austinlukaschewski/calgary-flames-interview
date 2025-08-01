const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
    darkMode: ['selector', 'html[data-theme="dark"]'],
    important: true,
    theme: {
        fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
        },
    },
    plugins: [
        require('daisyui'),
        plugin(({ addBase }) =>
            addBase({
                h1: {
                    fontFamily: 'Inter Tight',
                    fontSize: '2rem',
                    fontWeight: 600,
                    lineHeight: '2.75rem',
                    marginBottom: '2rem',
                },
                h2: {
                    fontFamily: 'Inter Tight',
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    lineHeight: '2.25rem',
                    marginBottom: '1.5rem',
                },
                h3: {
                    fontFamily: 'Inter Tight',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    lineHeight: '2rem',
                    marginBottom: '1rem',
                },
                h4: {
                    fontFamily: 'Inter Tight',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    lineHeight: '1.75rem',
                    marginBottom: '0.75rem',
                },
                h5: {
                    fontFamily: 'Inter Tight',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: '1.5rem',
                    marginBottom: '0.75rem',
                },
                h6: {
                    fontFamily: 'Inter Tight',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    lineHeight: '1.5rem',
                    marginBottom: '0.75rem',
                },
            }),
        ),
    ],
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/theming/themes')['light'],
                    primary: '#D2001C',
                    secondary: '#FAAF19'
                },
            },
        ],
        base: true,
        styled: true,
        utils: true,
        prefix: '',
        logs: true,
        themeRoot: ':root',
    },
};

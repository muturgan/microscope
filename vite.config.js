import { preact } from '@preact/preset-vite';
import { minify } from 'html-minifier-terser';
import { defineConfig } from 'vite';

const VITE_PORT = parseInt(process.env.VITE_PORT);

// Минификация итогового index.html после того, как Vite вставил в него
// теги скриптов и стилей. Удаляет комментарии и лишние пробелы.
function htmlMinifyPlugin() {
	return {
		name: 'html-minify',
		apply: 'build',
		transformIndexHtml: {
			order: 'post',
			async handler(html) {
				return await minify(html, {
					collapseWhitespace: true,
					conservativeCollapse: false,
					removeComments: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					keepClosingSlash: true,
					minifyCSS: false,
					minifyJS: false,
				});
			},
		},
	};
}


// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	if (command === 'serve' && !VITE_PORT) {
		throw new Error('VITE_PORT environment variable is not defined');
	}

	return {
		envPrefix: 'CLIENT_',
		root: '.',
		build: {
			cssMinify: 'esbuild',
			minify:    'terser',
			outDir:    './dist',
			emptyOutDir: true,
			// CSS не инлайним в HTML: desktop.css должен остаться отдельным
			// файлом, чтобы на мобильных он не загружался.
			assetsInlineLimit: (filePath) =>
				filePath.endsWith('.css') ? false : undefined,
		},
		server: {
			host:       '0.0.0.0',
			port:       VITE_PORT,
			strictPort: true,
			hmr:        {
				host:       '0.0.0.0',
				clientPort: VITE_PORT,
				port:       VITE_PORT,
				path:       '/hmr',
			},
		},
		preview: {
			host:       '0.0.0.0',
			port:       VITE_PORT,
			strictPort: true,
		},
		resolve: {
			alias: {
				'react':             'preact/compat',
				'react-dom':         'preact/compat',
				'react/jsx-runtime': 'preact/jsx-runtime',

				...(command === 'build' ? {} : {
					'fs':            '',
					'path':          '',
					'source-map-js': '',
					'url':           '',
				}),
			},
		},
		jsx: {
			factory: 'h',
			fragment: 'Fragment',
		},
		plugins: [preact(), htmlMinifyPlugin()],
	};
});

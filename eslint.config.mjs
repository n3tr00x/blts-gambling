import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const groups = [
	// 1. Node.js builtins
	['^node:', '^\\u0000', '^(fs|path|url|crypto)(/.*)?$'],
	// 2. External packages: react, next, axios, etc.
	['^react', '^next', '^@?\\w'],
	// 3. Internal aliases (np. @/components)
	['^@/'],
	// 4. Parent/sibling/index
	['^\\.\\.(?!/?$)', '^\\.\\./?$'],
	['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
	// 5. Types (TS)
	['^.+\\.d\\.ts$'],
	// 6. Styles
	['^.+\\.css$'],
];

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			import: importPlugin,
			'simple-import-sort': simpleImportSortPlugin,
		},
		rules: {
			'simple-import-sort/imports': ['error', { groups }],
			'simple-import-sort/exports': 'error',
		},
	},
];

export default eslintConfig;

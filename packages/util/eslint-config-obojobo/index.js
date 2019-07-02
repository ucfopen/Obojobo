module.exports = {
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"settings": {
		"react": {
			"version": "16.8.6"
		}
	},
	"parser": "babel-eslint",
	"globals": {
		"document": true,
		"mockStaticDate": false,
		"mockVirtual": false,
		"oboRequire": false,
		"validUUID": false,
		"window": true
	},
	"env": {
		"amd": true,
		"es6": true,
		"jest": true,
		"node": true
	},
	"rules": {
		"array-callback-return": "error",
		"brace-style": ["error", "1tbs", { "allowSingleLine": true }],
		"curly": ["error", "multi-line"],
		"eqeqeq": "error",
		"new-cap": ["error", { "capIsNewExceptions": ["express.Router"] }],
		"no-alert": "error",
		"no-console": "error",
		"no-debugger": "error",
		"no-duplicate-imports": "error",
		"no-eval": "error",
		"no-extend-native": "error",
		"no-floating-decimal": "error",
		"no-implied-eval": "error",
		"no-labels": "error",
		"no-lonely-if": "error",
		"no-loop-func": "error",
		"no-nested-ternary": "error",
		"no-new": "error",
		"no-new-func": "error",
		"no-new-wrappers": "error",
		"no-return-assign": "error",
		"no-self-compare": "error",
		"no-undefined": "error",
		"no-unneeded-ternary": "error",
		"no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
		"no-useless-return": "error",
		"no-var": "error",
		"no-with": "error",
		"prefer-const": "error",
		"radix": "error",
		"react/prop-types": "0",
		"yoda": "error"
	}
}

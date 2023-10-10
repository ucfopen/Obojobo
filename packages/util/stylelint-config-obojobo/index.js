module.exports = {
	"extends": "stylelint-config-standard-scss",
	"plugins": ["stylelint-declaration-strict-value"],
	"rules": {
		"at-rule-no-unknown": [
			true,
			{
				"ignoreAtRules": ["include", "mixin", "function", "return"]
			}
		],
		"unit-disallowed-list": [
			"px",
			{
				"ignoreProperties": {
					"px": ["/^border/", "/^transform/", "/box-shadow/", "perspective", "text-indent"]
				}
			}
		],
		"color-hex-length": "long",
		"scale-unlimited/declaration-strict-value": [["/color/", "font-family"]],

		// all below are new rule configurations following the jump to version 15
		// consider overhauling all of the styles to validate against the defaults for these rules
		// rather than ignore the rules entirely
		"shorthand-property-no-redundant-values": null,
		"color-function-notation": "legacy",
		"media-feature-range-notation": "prefix",
		"property-no-vendor-prefix": null,
		"alpha-value-notation": "number",
		"declaration-block-no-redundant-longhand-properties": null,
		"number-max-precision": 10,
		"no-invalid-position-at-import-rule": null,

		// allow for 'thing', 'thing-name', 'parent-name--thing-name', 'parent-name--thing-name--child-name' etc.
		"selector-class-pattern": /([\w]+[-]{0,2})+[\w]+/,
		"selector-id-pattern": /([\w]+[-]{0,2})+[\w]+/,
		"keyframes-name-pattern": /([\w]+[-]{0,2})+[\w]+/,

		"scss/no-global-function-names": null,
		"scss/at-mixin-argumentless-call-parentheses": null,
		"scss/double-slash-comment-empty-line-before": null,
		"scss/double-slash-comment-whitespace-inside": null,
		"scss/dollar-variable-empty-line-before": null,
		"scss/at-import-partial-extension": null,
		"scss/at-import-no-partial-leading-underscore": null,
		"scss/operator-no-unspaced": null,
	}
}

/*
Should convert this:

"content": {
	"vars": [
		{
			"name": "x",
			"type": "static-value",
			"value": "123"
		}
	],
}

To this:
<vars>
	<var name="x" type="static-value" value="123" />
</vars>

*/

const varsParser = vars => {
	if (!vars) return ''

	const varsXML = vars.map(v => {
		const attrs = Object.keys(v).map(k => `${k}="${v[k]}"`)
		return `<var ${attrs.join(' ')} />`
	})

	return `<variables>${varsXML.join('')}</variables>`
}

module.exports = varsParser

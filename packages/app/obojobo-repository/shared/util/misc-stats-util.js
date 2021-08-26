const convertHyphenBasedStringToCamelCase = s => {
	// E.g. camel-case ---> camelCase
	let camel = s
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.substring(1))
		.join('')
	camel = camel.charAt(0).toLowerCase() + camel.substring(1)
	return camel
}

const equals = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2)

module.exports = {
	convertHyphenBasedStringToCamelCase,
	equals
}

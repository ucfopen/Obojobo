const textGroupParser = require('../../src/text-group-parser')

describe('TextGroup parser', () => {
	const textGroup = {
		name: 'textGroup',
		elements: [
			{
				name: 't',
				attributes: { indent: '0' },
				value: []
			}
		]
	}

	function generateElement(name, text, attributes) {
		return {
			name,
			attributes,
			value: [
				{
					type: 'text',
					text
				}
			]
		}
	}

	function setTextGroupElements(elements) {
		textGroup.elements[0].value = elements
	}

	function checkStyleExpectations(style, type, start, end, data) {
		expect(style.type).toBe(type)
		expect(style.data).toEqual(data)
		expect(style.start).toBe(start)
		expect(style.end).toBe(end)
	}

	beforeEach(function() {
		setTextGroupElements([])
	})

	test('Parses "latex" tags with alt attributes', () => {
		setTextGroupElements([generateElement('latex', 'dog', { alt: 'test' })])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog')
		checkStyleExpectations(parsedStyles[0], '_latex', 0, 3, { alt: 'test' })
	})

	test('Parses "latex" tags without alt attributes', () => {
		setTextGroupElements([generateElement('latex', 'dog')])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog')
		checkStyleExpectations(parsedStyles[0], '_latex', 0, 3, {})
	})

	test('Parses two "a" tags with different href attributes', () => {
		setTextGroupElements([
			generateElement('a', 'dog', { href: 'testUrlOne' }),
			generateElement('a', ' fox', { href: 'testUrlTwo' })
		])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog fox')
		checkStyleExpectations(parsedStyles[0], 'a', 0, 3, { href: 'testUrlOne' })
		checkStyleExpectations(parsedStyles[1], 'a', 3, 7, { href: 'testUrlTwo' })
	})

	test('Strips nonstandard attributes from "a" tags', () => {
		setTextGroupElements([
			generateElement('a', 'dog', { href: 'testUrlOne' }),
			generateElement('a', ' fox', { href: 'testUrlTwo', prop: 'val' })
		])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog fox')
		checkStyleExpectations(parsedStyles[0], 'a', 0, 3, { href: 'testUrlOne' })
		checkStyleExpectations(parsedStyles[1], 'a', 3, 7, { href: 'testUrlTwo' })
	})

	test('Enforces expected data on "sup" tags', () => {
		setTextGroupElements([generateElement('sup', 'dog')])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog')
		checkStyleExpectations(parsedStyles[0], 'sup', 0, 3, 1)
	})

	test('Enforces expected data on "sub" tags and converts them to "sup" tags', () => {
		setTextGroupElements([generateElement('sub', 'dog')])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog')
		checkStyleExpectations(parsedStyles[0], 'sup', 0, 3, -1)
	})

	test('Converts "code" tags to "monospace" tags', () => {
		setTextGroupElements([generateElement('code', 'dog')])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog')
		checkStyleExpectations(parsedStyles[0], 'monospace', 0, 3, {})
	})

	test('Parses two unhandled ranges that use the same tag but have different attributes', () => {
		setTextGroupElements([
			generateElement('extra', 'dog', { prop: 'val' }),
			generateElement('extra', ' fox')
		])

		const parsed = textGroupParser(textGroup)
		const parsedStyles = parsed[0].text.styleList

		expect(parsed[0].text.value).toBe('dog fox')
		checkStyleExpectations(parsedStyles[0], 'extra', 0, 3, { prop: 'val' })
		checkStyleExpectations(parsedStyles[1], 'extra', 3, 7, {})
	})

	test('Handles undefined values', () => {
		textGroup.elements[0].value = undefined //eslint-disable-line no-undefined
		const parsed = textGroupParser(textGroup)

		expect(parsed[0].text.value).toBe('')
	})

	test('Handles null values', () => {
		textGroup.elements[0].value = null
		const parsed = textGroupParser(textGroup)

		expect(parsed[0].text.value).toBe('')
	})
})

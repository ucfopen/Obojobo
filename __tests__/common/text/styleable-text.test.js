import StyleableText from '../../../src/scripts/common/text/styleable-text'
import StyleRange from '../../../src/scripts/common/text/style-range'

describe('StyleableText', function() {
	let st, st1, st2

	beforeEach(function() {
		st = new StyleableText('123456789ABCDEF')
		st.styleText('a', 5, 10, { href: 'website.com' })
	})

	it('exports to an object', function() {
		expect(st.getExportedObject()).toEqual({
			value: '123456789ABCDEF',
			styleList: [
				{
					type: 'a',
					start: 5,
					end: 10,
					data: {
						href: 'website.com'
					}
				}
			]
		})
	})

	it('can set text', function() {
		st.setText('new text')

		expect(st.value).toEqual('new text')
		expect(st.styleList.length()).toBe(0)
	})

	it('can replace text', function() {
		st.replaceText(5, 10, '-12-')

		expect(st.value).toEqual('12345-12-BCDEF')
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 9, 'a', { href: 'website.com' }))
	})

	it('can append text', function() {
		st.styleText('b', 5, st.length)
		st.appendText('xyz')

		expect(st.value).toEqual('123456789ABCDEFxyz')
		st.styleList.styles.map(function(range) {
			if (range.type === 'b') {
				expect(range).toEqual(new StyleRange(5, 18, 'b'))
			}
		})
	})

	it('move existing styles forward when inserting text before a style range', function() {
		st.insertText(5, 'abcde')

		expect(st.value).toEqual('12345abcde6789ABCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(10, 15, 'a', { href: 'website.com' }))
	})

	it("doesn't modify styles when inserting text after a style range", function() {
		st.insertText(11, 'abcde')

		expect(st.value).toEqual('123456789ABabcdeCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 10, 'a', { href: 'website.com' }))
	})

	it('expands the range when inserting text at the ending edge of a style range', function() {
		st.insertText(10, 'abcde')

		expect(st.value).toEqual('123456789AabcdeBCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 15, 'a', { href: 'website.com' }))
	})

	it('removes styles when deleting the styled text', function() {
		st.deleteText(5, 10)

		expect(st.value).toEqual('12345BCDEF')
		expect(st.styleList.length()).toBe(0)
	})

	it('modifies styles when deleting a portion inside of the styled text', function() {
		st.deleteText(6, 10)

		expect(st.value).toEqual('123456BCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 6, 'a', { href: 'website.com' }))
	})

	it('modifies styles when deleting the left portion of the styled text', function() {
		st.deleteText(5, 9)

		expect(st.value).toEqual('12345ABCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 6, 'a', { href: 'website.com' }))
	})

	it('modifies styles when deleting the right portion of the styled text', function() {
		st.deleteText(6, 10)

		expect(st.value).toEqual('123456BCDEF')
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 6, 'a', { href: 'website.com' }))
	})

	it('deletes from the end when indicies not given', function() {
		st.deleteText(1)

		expect(st.getExportedObject()).toEqual({
			value: '1',
			styleList: null
		})
	})

	it('deletes from the beginning when indicies not given', function() {
		st.deleteText(null, 14)

		expect(st.getExportedObject()).toEqual({
			value: 'F',
			styleList: null
		})
	})

	it('deletes all text when no indicies given', function() {
		st.deleteText()

		expect(st.getExportedObject()).toEqual({
			value: '',
			styleList: null
		})
	})

	it('does nothing if delete text indicies in wrong order', function() {
		st.deleteText(5, 4)

		expect(st.getExportedObject()).toEqual({
			value: '123456789ABCDEF',
			styleList: [
				{
					type: 'a',
					start: 5,
					end: 10,
					data: {
						href: 'website.com'
					}
				}
			]
		})
	})

	it('styles text', function() {
		st.styleText('a', 0, 5, { href: 'website.com' })

		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(0, 10, 'a', { href: 'website.com' }))
	})

	it('unstyles text', function() {
		st.unstyleText('a', 6, 9)

		expect(st.styleList.length()).toBe(2)
		expect(st.getExportedObject().styleList).toEqual([
			{
				type: 'a',
				start: 5,
				end: 6,
				data: {
					href: 'website.com'
				}
			},
			{
				type: 'a',
				start: 9,
				end: 10,
				data: {
					href: 'website.com'
				}
			}
		])
	})

	it('first adds then removes style when toggled in a range larger than an existing style', function() {
		st.toggleStyleText('a', 0, 10, { href: 'website.com' })

		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(0, 10, 'a', { href: 'website.com' }))

		st.toggleStyleText('a', 0, 10, { href: 'website.com' })

		expect(st.styleList.length()).toBe(0)
	})

	it('first removes then adds style when toggled in a range within an existing style', function() {
		st.toggleStyleText('a', 6, 9, { href: 'website.com' })

		expect(st.styleList.length()).toBe(2)
		expect(st.getExportedObject().styleList).toEqual([
			{
				type: 'a',
				start: 5,
				end: 6,
				data: {
					href: 'website.com'
				}
			},
			{
				type: 'a',
				start: 9,
				end: 10,
				data: {
					href: 'website.com'
				}
			}
		])

		st.toggleStyleText('a', 6, 9, { href: 'website.com' })

		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 10, 'a', { href: 'website.com' }))
	})

	it('first removes then adds style when toggled in a range exactly containing an existing style', function() {
		st.toggleStyleText('a', 5, 10, { href: 'website.com' })

		expect(st.styleList.length()).toBe(0)

		st.toggleStyleText('a', 5, 10, { href: 'website.com' })
		expect(st.styleList.length()).toBe(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 10, 'a', { href: 'website.com' }))
	})

	it('uses the start and end of the text for toggleStyleText if none given', function() {
		expect(st.clone().toggleStyleText('b', 2)).toEqual(st.clone().toggleStyleText('b', 2, 15))
		expect(st.clone().toggleStyleText('b', null, 4)).toEqual(st.clone().toggleStyleText('b', 0, 4))
		expect(st.clone().toggleStyleText('b')).toEqual(st.clone().toggleStyleText('b', 0, 15))
	})

	it('uses the start and end of the text for styleText if none given', function() {
		expect(st.clone().styleText('b', 2)).toEqual(st.clone().styleText('b', 2, 15))
		expect(st.clone().styleText('b', null, 4)).toEqual(st.clone().styleText('b', 0, 4))
		expect(st.clone().styleText('b')).toEqual(st.clone().styleText('b', 0, 15))
	})

	it('uses the start and end of the text for unstyleText if none given', function() {
		expect(st.clone().unstyleText('b', 2)).toEqual(st.clone().unstyleText('b', 2, 15))
		expect(st.clone().unstyleText('b', null, 4)).toEqual(st.clone().unstyleText('b', 0, 4))
		expect(st.clone().unstyleText('b')).toEqual(st.clone().unstyleText('b', 0, 15))
	})

	it('splits a styleable text', function() {
		let sibling = st.split(6)

		expect(st.value).toEqual('123456')
		expect(st.styleList.length()).toEqual(1)
		expect(st.styleList.styles[0]).toEqual(new StyleRange(5, 6, 'a', { href: 'website.com' }))

		expect(sibling.value).toEqual('789ABCDEF')
		expect(sibling.styleList.length()).toEqual(1)
		expect(sibling.styleList.styles[0]).toEqual(new StyleRange(0, 4, 'a', { href: 'website.com' }))
	})

	it('splitting at the end will preserve styles for the newly created text', function() {
		st.styleText('b')

		let sibling = st.split(15)

		sibling.insertText(0, 'X')

		expect(sibling.getExportedObject()).toEqual({
			value: 'X',
			styleList: [
				{
					type: 'b',
					start: 0,
					end: 1,
					data: {}
				}
			]
		})
	})

	it('merges two styleable texts', function() {
		st1 = new StyleableText('abc')
		st1.styleText('a', 2, 3, { href: 'website.com' })

		st2 = new StyleableText('123')
		st2.styleText('a', 0, 1, { href: 'website.com' })
		st2.styleText('a', 2, 3, { href: 'website.com' })

		st1.merge(st2)

		//ab<a>c</a> + <a>1</a>2<a>3</a> = ab<a>c1</a>2<a>3</a>

		let similar = new StyleableText('abc123')
		similar.styleText('a', 2, 4, { href: 'website.com' })
		similar.styleText('a', 5, 6, { href: 'website.com' })

		expect(st1).toEqual(similar)
	})

	it('merges two styleable texts with an index', function() {
		st1 = new StyleableText('abc')
		st1.styleText('a', 2, 3, { href: 'website.com' })

		st2 = new StyleableText('123')
		st2.styleText('a', 0, 1, { href: 'website.com' })
		st2.styleText('a', 2, 3, { href: 'website.com' })

		st1.merge(st2, 0)

		//<a>1</a>2<a>3</a> + ab<a>c</a> = <a>1</a>2<a>3</a>ab<a>c</a>

		let similar = new StyleableText('123abc')
		similar.styleText('a', 0, 1, { href: 'website.com' })
		similar.styleText('a', 2, 3, { href: 'website.com' })
		similar.styleText('a', 5, 6, { href: 'website.com' })

		expect(st1).toEqual(similar)
	})

	it('can determine the style of an element', function() {
		let el

		// no styles:
		el = document.createTextNode('123')
		document.body.appendChild(el)
		expect(StyleableText.getStylesOfElement(el)).toEqual([])

		el = document.createElement('span')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([])

		// bold:
		el = document.createElement('b')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'b' }])

		el = document.createElement('span')
		document.body.appendChild(el)
		el.textContent = '123'
		el.style.fontWeight = 'bold'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'b' }])

		el = document.createElement('span')
		document.body.appendChild(el)
		el.textContent = '123'
		el.style.fontWeight = '900'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'b' }])

		// italic:
		el = document.createElement('i')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'i' }])

		el = document.createElement('span')
		document.body.appendChild(el)
		el.textContent = '123'
		el.style.fontStyle = 'italic'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'i' }])

		// strikethrough:
		el = document.createElement('s')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'del' }])

		el = document.createElement('span')
		document.body.appendChild(el)
		el.textContent = '123'
		el.style.textDecoration = 'line-through'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'del' }])

		// monospace:
		el = document.createElement('pre')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'monospace' }])

		el = document.createElement('code')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([{ type: 'monospace' }])

		// a:
		el = document.createElement('a')
		el.setAttribute('href', 'website.com')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([
			{
				type: 'a',
				data: {
					href: 'website.com'
				}
			}
		])

		// q:
		el = document.createElement('q')
		el.setAttribute('cite', 'Person McPersonface')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([
			{
				type: 'q',
				data: 'Person McPersonface'
			}
		])

		// sup
		el = document.createElement('sup')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([
			{
				type: 'sup',
				data: 1
			}
		])

		// sub
		el = document.createElement('sub')
		document.body.appendChild(el)
		el.textContent = '123'
		expect(StyleableText.getStylesOfElement(el)).toEqual([
			{
				type: 'sup',
				data: -1
			}
		])
	})

	// it.only('can create a styleable text from an element', () => {
	// 	let el = document.createElement('p')
	// 	document.body.appendChild(el)

	// 	el.innerHTML =
	// 		'<b>bold <i>italic</i></b> a <a href="google.com">link</a> <s>strike</s> y<sup>1</sup><sub>x</sub> <pre>mono</pre> <q cite="Person">Hello!</q>'

	// 	expect(StyleableText.createFromElement(el)[0].getExportedObject()).toEqual({
	// 		text: 'bold italic a link strike y1x mono Hello!',
	// 		styleList: [
	// 			{
	// 				type: 'b',
	// 				start: 0,
	// 				end: 11,
	// 				data: {}
	// 			},
	// 			{
	// 				type: 'i',
	// 				start: 5,
	// 				end: 11,
	// 				data: {}
	// 			},
	// 			{
	// 				type: 'a',
	// 				start: 14,
	// 				end: 18,
	// 				data: {
	// 					href: 'google.com'
	// 				}
	// 			},
	// 			{
	// 				type: 's',
	// 				start: 19,
	// 				end: 25,
	// 				data: {}
	// 			},
	// 			{
	// 				type: 'sup',
	// 				start: 21,
	// 				end: 22,
	// 				data: 1
	// 			},
	// 			{
	// 				type: 'sup',
	// 				start: 22,
	// 				end: 23,
	// 				data: -1
	// 			},
	// 			{
	// 				type: 'monospace',
	// 				start: 23,
	// 				end: 27,
	// 				data: {}
	// 			},
	// 			{
	// 				type: 'q',
	// 				start: 28,
	// 				end: 34,
	// 				data: {
	// 					cite: 'Person'
	// 				}
	// 			}
	// 		]
	// 	})
	// })
})

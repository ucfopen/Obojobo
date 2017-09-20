import styleableTextRenderer from '../../../src/scripts/common/text/styleable-text-renderer'
import StyleableText from '../../../src/scripts/common/text/styleable-text'

// convience function to easily compare a MockElement
let mockElToHTMLString = el => {
	if (el.nodeType === 'text') {
		if (el.html) return el.html
		return el.text
	}

	let attrs = []
	for (let attrName in el.attrs) {
		attrs.push(`${attrName}="${el.attrs[attrName]}"`)
	}
	if (attrs.length > 0) {
		attrs = ' ' + attrs.join(' ')
	} else {
		attrs = ''
	}

	return `<${el.type}${attrs}>${el.children
		.map(child => mockElToHTMLString(child))
		.join('')}</${el.type}>`
}

describe('styleableTextRenderer', () => {
	test('Non-styled text', () => {
		let st = new StyleableText('Test')
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>Test</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Empty string', () => {
		let st = new StyleableText()
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span></span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Styled text', () => {
		let st = new StyleableText('dog fox cat')
		st.styleText('b', 4, 7)
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>dog <b>fox</b> cat</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Styled text with attributes', () => {
		let st = new StyleableText('dog fox cat')
		st.styleText('a', 4, 7, { href: 'www.site.com' })
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>dog <a href="www.site.com">fox</a> cat</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Nested styles', () => {
		let st = new StyleableText('dog fox cat')
		st.styleText('b', 4, 7)
		st.styleText('i', 0, 9)
		st.styleText('del', 5, 6)
		let mockEl = styleableTextRenderer(st)

		// Style order, as defined by the ORDER constant in styleable-text-renderer
		// is b, then del, the i.

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>
				<i>dog </i>
				<b>
					<i>f</i>
					<del>
						<i>o</i>
					</del>
					<i>x</i>
				</b>
				<i> c</i>
				at
			</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Comment', () => {
		let st = new StyleableText('dog fox cat')
		st.styleText('_comment', 4, 7, { a: 1 })
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>dog <span class="comment" a="1">fox</span> cat</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test('Super/Subscripts', () => {
		let st = new StyleableText('dog-fox-cat')
		st.styleText('sup', 4, 7, 1)
		st.styleText('sup', 8, 11, -2)
		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>
				dog-
				<sup>fox</sup>
				-
				<sub>
					<sub>
						cat
					</sub>
				</sub>
			</span>
		`.replace(/[\t\n]/g, '')
		)
	})

	test.only('Nested Super/Subscripts', () => {
		let st = new StyleableText('dog-fox-cat')
		st.styleText('sup', 0, 11, 3)
		st.styleText('sup', 4, 7, -2)
		st.styleText('sup', 5, 6, -2)

		let mockEl = styleableTextRenderer(st)

		expect(mockElToHTMLString(mockEl)).toEqual(
			`
			<span>
				<sup>
					<sup>
						<sup>
							dog-
						</sup>
					</sup>
				</sup>
				<sup>
					f
				</sup>
				<sub>
					o
				</sub>
				<sup>
					x
				</sup>
				<sup>
					<sup>
						<sup>
							-cat
						</sup>
					</sup>
				</sup>
			</span>
		`.replace(/[\t\n]/g, '')
		)
	})
})

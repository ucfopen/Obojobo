import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

describe('TextUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('parseMarkings converts empty styleList to leaves', () => {
		const text = {
			value: '',
			styleList: []
		}

		const line = { text }

		expect(TextUtil.parseMarkings(line)).toMatchSnapshot()
	})

	test('parseMarkings converts styleList to leaves', () => {
		const text = {
			value: 'ThisTextIsFormatted',
			styleList: [
				{
					type: 'b',
					start: 0,
					end: 4
				},
				{
					type: 'i',
					start: 4,
					end: 8
				},
				{
					type: 'del',
					start: 8,
					end: 10
				},
				{
					type: 'a',
					start: 10,
					end: 14,
					data: {
						href: 'mockLink'
					}
				},
				{
					type: 'a',
					start: 14,
					end: 19,
					data: {
						href: 'mockOtherLink'
					}
				},
				{
					type: 'q',
					start: 4,
					end: 10
				},
				{
					type: 'sup',
					start: 8,
					end: 14,
					data: 13
				}
			]
		}

		const line = { text }

		expect(TextUtil.parseMarkings(line)).toMatchSnapshot()
	})

	test('parseMarkings converts styleList to leaves', () => {
		const text = {
			value: 'ThisTextIsFormatted',
			styleList: [
				{
					type: 'b',
					start: 0,
					end: 4
				},
				{
					type: 'i',
					start: 4,
					end: 8
				},
				{
					type: 'del',
					start: 8,
					end: 10
				},
				{
					type: 'a',
					start: 10,
					end: 19,
					data: {
						href: 'mockLink'
					}
				},
				{
					type: 'q',
					start: 4,
					end: 10
				},
				{
					type: 'sup',
					start: 8,
					end: 14,
					data: -13
				},
				{
					type: 'sup',
					start: 8,
					end: 12,
					data: 13
				}
			]
		}

		const line = { text }

		expect(TextUtil.parseMarkings(line)).toMatchSnapshot()
	})

	test('parseMarkings creates leaves without styleList', () => {
		const text = {
			value: 'ThisTextIsFormatted'
		}

		const line = { text }

		expect(TextUtil.parseMarkings(line)).toMatchSnapshot()
	})

	test('slateToOboText converts a text node to a textGroup', () => {
		const text = {
			children: [
				{
					text: 'This',
					b: true
				},
				{
					text: 'Text',
					i: true,
					q: true
				},
				{
					text: 'Is',
					del: true,
					q: true,
					sup: true,
					num: 13
				},
				{
					type: 'a',
					href: 'mockURL',
					children: [
						{
							text: 'Form',
							sup: true,
							num: 14,
							b: true
						}
					]
				},
				{
					type: 'a',
					href: 'mockotherURL',
					children: [{ text: 'atted' }]
				}
			]
		}

		const line = {
			text: { value: '', styleList: [] },
			data: { indent: 0 }
		}

		expect(TextUtil.slateToOboText(text, line)).toMatchSnapshot()
	})
})

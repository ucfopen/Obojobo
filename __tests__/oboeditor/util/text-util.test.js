import TextUtil from '../../../src/scripts/oboeditor/util/text-util'

describe('TextUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
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
					data: 13
				}
			]
		}

		const line = { text }

		expect(TextUtil.parseMarkings(line)).toMatchSnapshot()
	})

	test('slateToOboText converts a text node to a textGroup', () => {
		const text = {
			leaves: [
				{
					text: 'This',
					marks: [{ type: 'b', data: {} }]
				},
				{
					text: 'Text',
					marks: [{ type: 'i', data: {} }, { type: 'q', data: {} }]
				},
				{
					text: 'Is',
					marks: [
						{ type: 'del', data: {} },
						{ type: 'q', data: {} },
						{ type: 'sup', data: { num: 13 } }
					]
				},
				{
					text: 'Form',
					marks: [{ type: 'a', data: { href: 'mockLink' } }, { type: 'sup', data: { num: 13 } }]
				},
				{
					text: 'atted',
					marks: [{ type: 'a', data: { href: 'mockLink' } }]
				}
			]
		}

		const line = {
			text: { value: 'ThisTextIsFormatted', styleList: [] },
			data: { indent: 0 }
		}

		expect(TextUtil.slateToOboText(text, line)).toMatchSnapshot()
	})
})

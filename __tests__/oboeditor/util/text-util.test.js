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
			leaves: [
				{
					text: 'This',
					marks: [
						{
							type: 'b',
							data: { toJSON: () => 'mockJSON' }
						}
					]
				},
				{
					text: 'Text',
					marks: [
						{
							type: 'i',
							data: { toJSON: () => 'mockJSON' }
						},
						{
							type: 'q',
							data: { toJSON: () => 'mockJSON' }
						}
					]
				},
				{
					text: 'Is',
					marks: [
						{
							type: 'del',
							data: { toJSON: () => 'mockJSON' }
						},
						{
							type: 'q',
							data: { toJSON: () => 'mockJSON' }
						},
						{
							type: 'sup',
							data: { get: () => 13 }
						}
					]
				},
				{
					text: 'Form',
					marks: [
						{
							type: 'a',
							data: {
								toJSON: () => 'mockJSON'
							}
						},
						{
							type: 'sup',
							data: { get: () => 14 }
						}
					]
				},
				{
					text: 'atted',
					marks: [
						{
							type: 'a',
							data: { toJSON: () => 'mockJSON' }
						}
					]
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

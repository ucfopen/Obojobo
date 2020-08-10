import ColorMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/color-marks'
jest.mock('slate-react')

describe('ColorMark', () => {
	test('renderLeaf diplays expected style', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: { color: '#000000' },
				children: 'mockChild'
			})
		).toMatchSnapshot()
	})

	test('renderLeaf does nothing', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: {},
				children: 'mockChild'
			})
		).toMatchSnapshot()
	})

	test('color action does nothing', () => {
		expect(ColorMark.marks[0].action()).toBeUndefined()
	})
})

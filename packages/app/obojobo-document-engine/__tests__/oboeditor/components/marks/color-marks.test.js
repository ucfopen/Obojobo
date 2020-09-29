import ColorMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/color-marks'
jest.mock('slate-react')
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')

describe('ColorMark', () => {
	test('renderLeaf diplays expected style', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: { color: '#000000' },
				children: 'mockChild'
			})
		).toMatchInlineSnapshot(`
		Object {
		  "children": <span
		    style={
		      Object {
		        "color": "#000000",
		      }
		    }
		  >
		    mockChild
		  </span>,
		  "leaf": Object {
		    "color": "#000000",
		  },
		}
	`)
	})

	test('renderLeaf does nothing when mark is not color', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: {},
				children: 'mockChild'
			})
		).toMatchInlineSnapshot(`
		Object {
		  "children": "mockChild",
		  "leaf": Object {},
		}
	`)
	})

	test('color action', () => {
		ColorMark.marks[0].action()
		expect(Dispatcher.trigger).toHaveBeenCalled()
	})
})

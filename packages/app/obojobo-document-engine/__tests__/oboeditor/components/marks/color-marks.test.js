import ColorMark from 'obojobo-document-engine/src/scripts/oboeditor/components/marks/color-marks'
jest.mock('slate-react')
import Dispatcher from 'obojobo-document-engine/src/scripts/common/flux/dispatcher'
jest.mock('obojobo-document-engine/src/scripts/common/flux/dispatcher')

describe('ColorMark', () => {
	beforeEach(() => {
		Dispatcher.trigger.mockRestore()
	})

	test('renderLeaf displays expected style', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: { color: '#000000' },
				children: {
					props: 'mockChildProps'
				}
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
		    Object {
		      "props": "mockChildProps",
		    }
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
				children: {
					props: 'mockChildProps'
				}
			})
		).toMatchInlineSnapshot(`
		Object {
		  "children": Object {
		    "props": "mockChildProps",
		  },
		  "leaf": Object {},
		}
	`)
	})

	test('renderLeaf does not style HTML nodes', () => {
		expect(
			ColorMark.plugins.renderLeaf({
				leaf: { color: '#000000' },
				children: {
					props: {
						parent: {
							type: 'ObojoboDraft.Chunks.HTML'
						}
					}
				}
			})
		).toMatchInlineSnapshot(`
		Object {
		  "children": Object {
		    "props": Object {
		      "parent": Object {
		        "type": "ObojoboDraft.Chunks.HTML",
		      },
		    },
		  },
		  "leaf": Object {
		    "color": "#000000",
		  },
		}
		`)
	})

	test('color action', () => {
		ColorMark.marks[0].action()
		expect(Dispatcher.trigger).toHaveBeenCalled()
	})

	test('onKeyDown opens the color picker with the right keyboard shortcut', () => {
		const mockPreventDefault = jest.fn()

		ColorMark.plugins.onKeyDown({ ctrlKey: true, key: 'p', preventDefault: mockPreventDefault })
		expect(Dispatcher.trigger).not.toHaveBeenCalled()
		expect(mockPreventDefault).not.toHaveBeenCalled()

		ColorMark.plugins.onKeyDown({
			ctrlKey: true,
			shiftKey: true,
			key: 'p',
			preventDefault: mockPreventDefault
		})
		expect(Dispatcher.trigger).toHaveBeenCalledWith('color-picker:open')
		expect(mockPreventDefault).toHaveBeenCalled()
	})
})

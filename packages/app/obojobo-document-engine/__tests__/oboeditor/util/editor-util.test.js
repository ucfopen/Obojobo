import Common from '../../../src/scripts/common/index'
import EditorUtil from '../../../src/scripts/oboeditor/util/editor-util'
import mockConsole from 'jest-mock-console'
jest.mock('../../../src/scripts/common/index', () => ({
	models: {
		OboModel: {
			models: {
				mockAssessment: {
					id: 'mockAssessment',
					get: jest.fn()
				}
			}
		}
	},
	flux: {
		Dispatcher: {
			trigger: jest.fn(),
			on: jest.fn(),
			off: jest.fn()
		}
	}
}))

let restoreConsole

describe('EditorUtil', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		restoreConsole = mockConsole('error')
	})

	afterEach(() => {
		restoreConsole()
	})

	test('rebuildMenu calls editor:rebuildMenu', () => {
		EditorUtil.rebuildMenu('mockOboModel')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:rebuildMenu', {
			value: { model: 'mockOboModel' }
		})
	})
	test('goto calls editor:goto', () => {
		EditorUtil.goto('mockId')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:goto', {
			value: { id: 'mockId' }
		})
	})
	test('addPage calls editor:addPage', () => {
		EditorUtil.addPage('mockOboModel')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:addPage', {
			value: { newPage: 'mockOboModel' }
		})
	})
	test('addAssessment calls editor:addAssessment', () => {
		EditorUtil.addAssessment('mockOboModel')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:addAssessment', {
			value: { newAssessment: 'mockOboModel' }
		})
	})
	test('deletePage calls editor:deletePage', () => {
		EditorUtil.deletePage('mockId')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:deletePage', {
			value: { pageId: 'mockId' }
		})
	})
	test('setStartPage calls editor:setStartPage', () => {
		EditorUtil.setStartPage('mockId')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:setStartPage', {
			value: { pageId: 'mockId' }
		})
	})
	test('gotoPath calls editor:gotoPath', () => {
		EditorUtil.gotoPath('mockPath')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:gotoPath', {
			value: { path: 'mockPath' }
		})
	})
	test('getFirst gets the ordered list and returns the first link', () => {
		const mockState = {
			navItems: {
				id: 'mockId',
				type: 'hidden',
				showChildren: true,
				children: [
					{ type: 'not-link', id: 1, showChildren: false },
					{ type: 'link', id: 2, showChildren: false }
				]
			}
		}

		const firstItem = EditorUtil.getFirst(mockState)

		expect(firstItem).toEqual({ id: 2, showChildren: false, type: 'link' })
	})

	test('getFirst returns null when no link items exist', () => {
		const mockState = {
			navItems: {
				id: 'mockId',
				type: 'hidden',
				showChildren: true,
				children: [{ type: 'not-link', id: 1, showChildren: false }]
			}
		}

		const firstItem = EditorUtil.getFirst(mockState)

		expect(firstItem).toEqual(null)
	})

	test('getNavItemForModel returns the correct model', () => {
		const mockState = {
			itemsById: {
				mockId: 'mockItem'
			}
		}

		const mockModel = {
			get: jest.fn().mockReturnValueOnce('mockId')
		}

		const navItem = EditorUtil.getNavItemForModel(mockState, mockModel)

		expect(navItem).toEqual('mockItem')
	})

	test('getNavItemForModel returns null whith no match', () => {
		const mockState = {
			itemsById: {
				mockId: 'mockItem'
			}
		}

		const mockModel = {
			get: jest.fn().mockReturnValueOnce('mockOtherId')
		}

		const navItem = EditorUtil.getNavItemForModel(mockState, mockModel)

		expect(navItem).toEqual(null)
	})

	test('getNavLabelForModel returns the correct model', () => {
		const mockState = {
			itemsById: {
				mockId: { label: 'mockLabel' }
			}
		}

		const mockModel = {
			get: jest.fn().mockReturnValueOnce('mockId')
		}

		const navLabel = EditorUtil.getNavLabelForModel(mockState, mockModel)

		expect(navLabel).toEqual('mockLabel')
	})

	test('getNavLabelForModel returns null whith no match', () => {
		const mockState = {
			itemsById: {
				mockId: { label: 'mockLabel' }
			}
		}

		const mockModel = {
			get: jest.fn().mockReturnValueOnce('mockOtherId')
		}

		const navLabel = EditorUtil.getNavLabelForModel(mockState, mockModel)

		expect(navLabel).toEqual(null)
	})

	test('getOrderedList generates a nav list', () => {
		const mockState = {
			navItems: {
				id: 'mockId',
				type: 'hidden',
				showChildren: true,
				children: [
					{ type: 'not-link', id: 1, showChildren: false },
					{ type: 'link', id: 2, showChildren: false }
				]
			}
		}

		const items = EditorUtil.getOrderedList(mockState)

		expect(items).toEqual([
			{ type: 'not-link', id: 1, showChildren: false },
			{ id: 2, showChildren: false, type: 'link' }
		])
	})

	test('getOrderedList generates assessment items', () => {
		const mockState = {
			navItems: {
				id: 'mockId',
				type: 'hidden',
				showChildren: true,
				children: [
					{ type: 'not-link', id: 1, showChildren: false },
					{ type: 'link', id: 2, showChildren: false },
					{ id: 'mockAssessment', type: 'link', flags: {}, showChildren: false }
				]
			}
		}

		Common.models.OboModel.models.mockAssessment.get.mockReturnValueOnce(
			'ObojoboDraft.Sections.Assessment'
		)

		const items = EditorUtil.getOrderedList(mockState)

		expect(items).toEqual([
			{ id: 1, showChildren: false, type: 'not-link' },
			{ id: 2, showChildren: false, type: 'link' },
			{
				flags: { assessment: true },
				id: 'mockAssessment',
				showChildren: false,
				type: 'link'
			}
		])
	})

	test('getNavTarget returns the current target', () => {
		const mockState = {
			itemsById: {
				mockId: 'mockItem'
			},
			navTargetId: 'mockId'
		}

		const navItem = EditorUtil.getNavTarget(mockState)

		expect(navItem).toEqual('mockItem')
	})

	test('getNavTargetModel returns the current targets model', () => {
		const mockState = {
			itemsById: {
				mockAssessment: { id: 'mockAssessment' }
			},
			navTargetId: 'mockAssessment'
		}

		const navModel = EditorUtil.getNavTargetModel(mockState)

		expect(navModel).toEqual({
			id: 'mockAssessment',
			get: expect.any(Function)
		})
	})

	test('getNavTargetModel returns null with no item', () => {
		const mockState = {
			itemsById: {
				mockAssessment: { id: 'mockAssessment' }
			},
			navTargetId: 'mockNoItem'
		}

		const navModel = EditorUtil.getNavTargetModel(mockState)

		expect(navModel).toEqual(null)
	})

	test('renamePage calls editor:renamePage', () => {
		EditorUtil.renamePage('mockId', 'newName')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:renamePage', {
			value: { pageId: 'mockId', name: 'newName' }
		})
	})

	test('movePage calls editor:movePage', () => {
		EditorUtil.movePage('mockId', 'newIndex')

		expect(Common.flux.Dispatcher.trigger).toHaveBeenCalledWith('editor:movePage', {
			value: { pageId: 'mockId', index: 'newIndex' }
		})
	})

	test('getTitleFromJSON returns unnamed', () => {
		const title = EditorUtil.getTitleFromString('{"content":{"title":"  "}}', 'json')

		expect(title).toEqual('(Unnamed Module)')
	})

	test('getTitleFromJSON returns title', () => {
		const title = EditorUtil.getTitleFromString('{"content":{"title":"Mock Title"}}', 'json')

		expect(title).toEqual('Mock Title')
	})

	test('getTitleFromJSON throws error and returns unnamed', () => {
		const title = EditorUtil.getTitleFromString('invalid-json-string', 'json')
		expect(title).toEqual('(Unnamed Module)')
		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalledWith(expect.any(Error))
		// eslint-disable-next-line no-console
		expect(console.error.mock.calls[0][0].message).toBe('Unexpected token i in JSON at position 0')
	})

	test('getTitleFromXML returns unnamed', () => {
		const title = EditorUtil.getTitleFromString({}, 'xml')
		expect(title).toEqual('(Unnamed Module)')
	})

	test('getTitleFromXML returns title from long name xml', () => {
		const title = EditorUtil.getTitleFromString(
			'<?xml version="1.0" encoding="utf-8"?><ObojoboDraft.Modules.Module title="My XML"></ObojoboDraft.Modules.Module>',
			'xml'
		)
		expect(title).toEqual('My XML')
	})

	test('getTitleFromXML returns title from short name xml', () => {
		const title = EditorUtil.getTitleFromString(
			'<?xml version="1.0" encoding="utf-8"?><Module title="  "></Module>',
			'xml'
		)
		expect(title).toEqual('(Unnamed Module)')
	})

	test('getTitleFromXML throws error and returns unnamed', () => {
		jest.spyOn(EditorUtil, 'isEmptyString')
		EditorUtil.isEmptyString.mockImplementation(() => {
			throw new Error()
		})
		const title = EditorUtil.getTitleFromString(
			'<?xml version="1.0" encoding="utf-8"?><Module title="  "></Module>',
			'xml'
		)
		expect(title).toEqual('(Unnamed Module)')
		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalledWith(expect.any(Error))
	})
})

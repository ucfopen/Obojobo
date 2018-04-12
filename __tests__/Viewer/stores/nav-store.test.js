jest.mock('../../../src/scripts/viewer/util/api-util', () => ({
	postEvent: jest.fn()
}))

// Nav Util
jest.mock('../../../src/scripts/viewer/util/nav-util', () => ({
	getFirst: jest.fn(),
	getPrev: jest.fn(),
	getNext: jest.fn(),
	setFlag: jest.fn(),
	canNavigate: jest.fn(),
	gotoPath: jest.fn(),
	goto: jest.fn(),
	toggle: jest.fn(),
	getOrderedList: jest.fn(),
	getNavTargetModel: jest.fn()
}))

const Common = require('../../../src/scripts/common/index').default
const NavUtil = require('../../../src/scripts/viewer/util/nav-util')
const APIUtil = require('../../../src/scripts/viewer/util/api-util')
jest.spyOn(Common.flux.Dispatcher, 'on')
const NavStore = require('../../../src/scripts/viewer/stores/nav-store').default

describe('NavStore', () => {
	beforeAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should init state with basic options', () => {
		NavStore.init(null, 12, '', 11)
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init state locked state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isLocked': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init state open state', () => {
		NavStore.init(null, 12, '', 11, { 'nav:isOpen': { value: true } })
		expect(NavStore.getState()).toMatchSnapshot()
	})

	it('should init and go to starting path', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.gotoPath).toHaveBeenCalledWith('startingpath')
	})

	it('should init go to starting id', () => {
		NavStore.init(null, 12, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith(12)
	})

	it('should init and go to first with no starting id', () => {
		NavUtil.getFirst.mockReturnValueOnce({ id: 'mockFirstId' })
		NavStore.init(null, null, 'startingpath', 11)
		expect(NavUtil.goto).toHaveBeenCalledWith('mockFirstId')
	})

	it('buildMenu should reset menu items', () => {
		jest.spyOn(NavStore, 'generateNav')
		NavStore.generateNav.mockImplementationOnce(model => model)

		let before = NavStore.getState()
		NavStore.buildMenu('mockModel')
		let after = NavStore.getState()

		expect(after).toMatchSnapshot()

		// the before and after objects should'nt be ===
		expect(after.itemsById).not.toBe(before.itemsById)
		expect(after.itemsByPath).not.toBe(before.itemsByPath)
		expect(after.itemsByFullPath).not.toBe(before.itemsByFullPath)
	})

	it('gotoItem with null returns false', () => {
		expect(NavStore.gotoItem(null)).toBe(false)
	})

	it('gotoItem doest do anything when already on that item', () => {
		NavStore.setState({
			navTargetId: 'mockId'
		})
		expect(NavStore.gotoItem({ id: 'mockId' })).toBe()
	})

	it('gotoItem sends triggers events and updates history', () => {
		jest.spyOn(NavStore, 'triggerChange')
		NavStore.setState({
			navTargetId: 'mockId',
			navTargetHistory: [],
			itemsById: {
				mockId: {
					showChildren: true
				}
			}
		})
		let oldNavItem = { processTrigger: jest.fn() }
		let newNavItem = {
			id: 'newItem',
			showChildrenOnNavigation: true,
			processTrigger: jest.fn()
		}
		NavUtil.getNavTargetModel.mockReturnValueOnce(oldNavItem)
		NavUtil.getNavTargetModel.mockReturnValueOnce(newNavItem)

		expect(NavStore.gotoItem(newNavItem)).toBe(true)
		let after = NavStore.getState()
		expect(after).toMatchSnapshot()
		expect(oldNavItem.processTrigger).toHaveBeenCalledWith('onNavExit')
		expect(newNavItem.processTrigger).toHaveBeenCalledWith('onNavEnter')
		expect(NavStore.triggerChange).toHaveBeenCalledTimes(1)
	})

	it('generateNav with no model returns empty objec ', () => {
		expect(NavStore.generateNav()).toEqual({})
	})

	it('generateNav builds a navItem', () => {
		let item = {
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem',
				path: 'whatever'
			})
		}
		let childItem = {
			get: () => 9,
			children: {
				models: []
			},
			getNavItem: jest.fn().mockReturnValueOnce({
				id: 'mockItem2',
				path: 'whatever2'
			})
		}
		let model = {
			get: () => 11,
			getRoot: () => ({ get: () => 66 }),
			children: {
				models: [childItem]
			}
		}
		jest.spyOn(Common.Store, 'getItemForType')
		Common.Store.getItemForType.mockReturnValueOnce(item)
		Common.Store.getItemForType.mockReturnValueOnce(childItem)

		NavStore.setState({
			itemsByPath: {},
			itemsByFullPath: {},
			itemsById: {},
			visitId: 'visitId'
		})
		expect(NavStore.generateNav(model)).toMatchSnapshot()
		expect(NavStore.getState()).toMatchSnapshot()
	})
})

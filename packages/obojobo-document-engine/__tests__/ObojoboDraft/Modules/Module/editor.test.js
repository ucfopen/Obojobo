/* eslint no-undefined: 0 */

import Common from 'Common'
import '../../../../ObojoboDraft/Modules/Module/editor'

jest.mock('Common', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

describe('Modules/Module editor', () => {
	test('registers model with expected values', () => {
		const modulesModuleMock = Common.Registry.registerModel.mock.calls[0][1]

		expect(modulesModuleMock.slateToObo()).toBe(undefined)
		expect(modulesModuleMock.oboToSlate()).toBe(undefined)

		expect(JSON.stringify(modulesModuleMock)).toEqual(
			JSON.stringify({
				name: 'Module',
				ignore: true,
				isInsertable: false,
				slateToObo: () => {},
				oboToSlate: () => {},
				plugins: null,
				getNavItem(model) {
					return {
						type: 'heading',
						label: model.title,
						showChildren: true
					}
				}
			})
		)
	})
	test('getNavItem returns expected object', () => {
		const modulesModuleMock = Common.Registry.registerModel.mock.calls[0][1]

		const model = {
			title: 'TestTitle'
		}

		expect(modulesModuleMock.getNavItem(model)).toEqual({
			type: 'heading',
			label: 'TestTitle',
			showChildren: true
		})
	})
})

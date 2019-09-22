/* eslint no-undefined: 0 */

import Common from 'obojobo-document-engine/src/scripts/common/index'
import './editor-registration'

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	}
}))

describe('Sections/Content editor', () => {
	test('registers model with expected values', () => {
		const sectionsContentMock = Common.Registry.registerModel.mock.calls[0][1]

		expect(sectionsContentMock.slateToObo()).toBe(undefined)
		expect(sectionsContentMock.oboToSlate()).toBe(undefined)

		expect(JSON.stringify(sectionsContentMock)).toEqual(
			JSON.stringify({
				name: 'Section Content',
				ignore: true,
				isInsertable: false,
				slateToObo: () => {},
				oboToSlate: () => {},
				plugins: null,
				getNavItem: () => ({
					type: 'hidden',
					showChildren: true
				})
			})
		)
	})
	test('getNavItem returns expected object', () => {
		const sectionsContentMock = Common.Registry.registerModel.mock.calls[0][1]

		expect(sectionsContentMock.getNavItem()).toEqual({
			showChildren: true,
			type: 'hidden'
		})
	})
})

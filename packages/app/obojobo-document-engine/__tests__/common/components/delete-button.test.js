import DeleteButtonBase from '../../../src/scripts/common/components/delete-button-base'
import withPageFocus from '../../../src/scripts/common/util/with-page-focus'

jest.mock('../../../src/scripts/common/components/delete-button-base')
jest.mock('../../../src/scripts/common/util/with-page-focus')

describe('Delete Button With Focus', () => {
	test('withPageFocus HOC is applied to DeleteButtonBase', () => {
		require('../../../src/scripts/common/components/delete-button').default
		expect(withPageFocus).toHaveBeenCalledWith(DeleteButtonBase)
	})
})

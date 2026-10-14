import DeleteButtonBase from './delete-button-base'
import withPageFocus from '../util/with-page-focus'

jest.mock('./delete-button-base')
jest.mock('../util/with-page-focus')

describe('Delete Button With Focus', () => {
	test('withPageFocus HOC is applied to DeleteButtonBase', () => {
		require('./delete-button').default
		expect(withPageFocus).toHaveBeenCalledWith(DeleteButtonBase)
	})
})

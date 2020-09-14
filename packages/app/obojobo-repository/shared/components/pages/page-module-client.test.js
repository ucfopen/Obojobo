jest.mock('../../react-utils')
jest.mock('./page-module')
jest.mock('../../reducers/dashboard-reducer')

const ReactUtils = require('../../react-utils')
const PageModule = require('./page-module')

describe('Client-side Module Page', () => {
	test('passes the right arguments to ReactUtils.hydrateElWithoutStore', () => {
		// just need to require this, it will run itself
		require('./page-module-client')

		expect(ReactUtils.hydrateElWithoutStore).toHaveBeenCalledWith(PageModule, '#react-hydrate-root')
	})
})

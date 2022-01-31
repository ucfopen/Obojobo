jest.mock('../../react-utils')
jest.mock('./page-module-hoc')
jest.mock('../../reducers/about-module-reducer')

const ReactUtils = require('../../react-utils')
const PageModule = require('./page-module-hoc')
const AboutModuleReducer = require('../../reducers/about-module-reducer')

describe('Client-side Module Page', () => {
	test('passes the right arguments to ReactUtils.hydrateElWithoutStore', () => {
		// just need to require this, it will run itself
		require('./page-module-client')

		expect(ReactUtils.hydrateEl).toHaveBeenCalledWith(
			PageModule,
			AboutModuleReducer,
			'#react-hydrate-root'
		)
	})
})

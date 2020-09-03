jest.mock('../../react-utils')
jest.mock('../dashboard-hoc')
jest.mock('../../reducers/dashboard-reducer')

const ReactUtils = require('../../react-utils')
const Dashboard = require('../dashboard-hoc')
const DashboardReducer = require('../../reducers/dashboard-reducer')

describe('Client-side Dashboard Page', () => {
	test('passes the right arguments to ReactUtils.hydrateEl', () => {
		// just need to require this, it will run itself
		require('./page-dashboard-client')

		expect(ReactUtils.hydrateEl).toHaveBeenCalledWith(
			Dashboard,
			DashboardReducer,
			'#react-hydrate-root'
		)
	})
})

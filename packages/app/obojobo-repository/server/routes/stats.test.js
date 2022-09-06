jest.unmock('fs') // need fs working for view rendering
jest.unmock('express') // we'll use supertest + express for this
jest.mock(
	'obojobo-express/server/asset_resolver',
	() => ({
		assetForEnv: path => path,
		webpackAssetPath: path => path
	}),
	{ virtual: true }
)

jest.setTimeout(10000) // extend test timeout?

// override requireCurrentUser for tests to provide our own user
let mockCurrentUser

jest.mock('obojobo-express/server/express_current_user', () => (req, res, next) => {
	req.requireCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.getCurrentUser = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	req.requireCanViewStatsPage = () => {
		req.currentUser = mockCurrentUser
		return Promise.resolve(mockCurrentUser)
	}
	next()
})

let mockStatsComponent
let mockStatsComponentConstructor
jest.mock('obojobo-repository/shared/components/pages/page-stats-server')

const componentPropsDesiredProperties = ['title', 'currentUser', 'allModules']

// setup express server
const path = require('path')
const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// register express-react-views template engine if not already registered
app.engine('jsx', require('express-react-views-custom').createEngine())

app.set('view engine', 'jsx')

let viewPaths = app.get('views')
if (!Array.isArray(viewPaths)) viewPaths = [viewPaths]
viewPaths.push(path.resolve(`${__dirname}/../../shared/components`)) // add the components dir so babel can transpile the jsx
app.set('views', viewPaths)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(require('obojobo-express/server/express_current_user'))

app.use('/', require('obojobo-express/server/express_response_decorator'))
app.use('/', require('obojobo-repository/server/routes/stats'))

describe('repository stats route', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		mockCurrentUser = {
			id: 99,
			// return true when the perm being asked about is 'canViewStatsPage
			hasPermission: perm => perm === 'canViewStatsPage'
		}

		//there's extra express garbage attached to the props we care about
		//this roundabout solution exists to only pull out the ones we want
		mockStatsComponentConstructor = jest.fn()
		mockStatsComponent = require('obojobo-repository/shared/components/pages/page-stats-server')
		mockStatsComponent.mockImplementation(props => {
			const desiredProps = {}
			componentPropsDesiredProperties.forEach(prop => {
				desiredProps[prop] = props[prop]
			})
			mockStatsComponentConstructor(desiredProps)
			return ''
		})
	})

	test('get /stats returns a "not authorized" if the viewer does not have canViewStatsPage', () => {
		// always return false - a.k.a. the user does not have the right perms to use this
		mockCurrentUser.hasPermission = () => false

		expect.hasAssertions()

		return request(app)
			.get('/stats')
			.then(response => {
				expect(mockStatsComponent).toHaveBeenCalledTimes(0)
				expect(response.statusCode).toBe(401)
			})
	})

	test('get /stats sends the correct props to the Stats component when the user has canViewStatsPage', () => {
		expect.hasAssertions()

		return request(app)
			.get('/stats')
			.then(response => {
				expect(mockStatsComponent).toHaveBeenCalledTimes(1)
				expect(mockStatsComponentConstructor).toHaveBeenCalledWith({
					title: 'Stats',
					currentUser: mockCurrentUser
				})
				expect(response.statusCode).toBe(200)
			})
	})
})

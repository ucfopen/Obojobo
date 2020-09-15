jest.mock('../models/draft_summary')
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
	next()
})

let mockDashboardComponent
let mockDashboardComponentConstructor
jest.mock('obojobo-repository/shared/components/pages/page-dashboard-server')

const componentPropsDesiredProperties = ['title', 'currentUser', 'sortOrder', 'myModules']

let DraftSummary

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
app.use('/', require('obojobo-repository/server/routes/dashboard'))

describe('repository dashboard route', () => {
	const mockModuleSummary = [
		{
			draftId: 'mockDraftId',
			title: 'mockDraftTitle'
		},
		{
			draftId: 'mockDraftId2',
			title: 'mockDraftTitle2'
		},
		{
			draftId: 'mockDraftId3',
			title: 'mockDraftTitle3'
		}
	]

	beforeEach(() => {
		jest.resetAllMocks()
		mockCurrentUser = {
			id: 99,
			canPreviewDrafts: true
		}
		DraftSummary = require('../models/draft_summary')

		//there's extra express garbage attached to the props we care about
		//this roundabout solution exists to only pull out the ones we want
		mockDashboardComponentConstructor = jest.fn()
		mockDashboardComponent = require('obojobo-repository/shared/components/pages/page-dashboard-server')
		mockDashboardComponent.mockImplementation(props => {
			const desiredProps = {}
			componentPropsDesiredProperties.forEach(prop => {
				desiredProps[prop] = props[prop]
			})
			mockDashboardComponentConstructor(desiredProps)
			return ''
		})
	})

	const generateCookie = (order = 'alphabetical') => {
		const expires = new Date()
		expires.setFullYear(expires.getFullYear() + 1)
		const commonCookieString = `expires=${expires.toUTCString()}; path=dashboard`
		return `sortOrder=${order}; ${commonCookieString}`
	}

	test('get /dashboard sends the correct props to the Dashboard component - specific cookie', () => {
		expect.hasAssertions()

		DraftSummary.fetchByUserId = jest.fn()
		DraftSummary.fetchByUserId.mockResolvedValueOnce(mockModuleSummary)

		return request(app)
			.get('/dashboard')
			.set('cookie', [generateCookie('newest')])
			.then(response => {
				expect(DraftSummary.fetchByUserId).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(mockDashboardComponent).toHaveBeenCalledTimes(1)
				expect(mockDashboardComponentConstructor).toHaveBeenCalledWith({
					title: 'Dashboard',
					currentUser: mockCurrentUser,
					sortOrder: 'newest',
					myModules: mockModuleSummary
				})
				expect(response.statusCode).toBe(200)
			})
	})

	test('get /dashboard sends the correct props to the Dashboard component - no cookie', () => {
		expect.hasAssertions()

		DraftSummary.fetchByUserId = jest.fn()
		DraftSummary.fetchByUserId.mockResolvedValueOnce(mockModuleSummary)

		return request(app)
			.get('/dashboard')
			.set('cookie', null)
			.then(response => {
				expect(DraftSummary.fetchByUserId).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(mockDashboardComponent).toHaveBeenCalledTimes(1)
				expect(mockDashboardComponentConstructor).toHaveBeenCalledWith({
					title: 'Dashboard',
					currentUser: mockCurrentUser,
					sortOrder: 'newest',
					myModules: mockModuleSummary
				})
				expect(response.statusCode).toBe(200)
			})
	})
})

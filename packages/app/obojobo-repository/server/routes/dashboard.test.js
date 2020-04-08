/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
jest.mock('obojobo-express/server/express_validators')
jest.mock('../models/collection_summary')
jest.mock('../models/draft_summary')
jest.mock('../services/permissions')
jest.mock('../services/count')
jest.mock('short-uuid')
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

let mockDashboardComponent
let mockDashboardComponentConstructor
jest.mock('obojobo-repository/shared/components/pages/page-dashboard-server')

const { MODE_RECENT, MODE_ALL, MODE_COLLECTION } = require('../../shared/repository-constants')

const componentPropsDesiredProperties = [
	'title',
	'collection',
	'currentUser',
	'mode',
	'moduleCount',
	'moduleSortOrder',
	'collectionSortOrder',
	'myCollections',
	'myModules'
]

let CollectionSummary
let DraftSummary
let PermissionsServices
let CountServices

let short
let mockShortFromUUID
let mockShortToUUID

// override requireCurrentUser for tests to provide our own user
let mockCurrentUser

jest.mock(
	'obojobo-express/server/express_validators',
	() => ({
		requireCanPreviewDrafts: () => jest.fn(),
		requireCurrentUser: () => jest.fn()
	}),
	{ virtual: true }
)

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
	const mockCollectionSummary = [
		{
			id: 'mockCollectionId',
			title: 'mockCollectionTitle'
		},
		{
			id: 'mockCollectionId2',
			title: 'mockCollectionTitle2'
		},
		{
			id: 'mockCollectionId3',
			title: 'mockCollectionTitle3'
		}
	]

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
		CollectionSummary = require('../models/collection_summary')
		DraftSummary = require('../models/draft_summary')
		PermissionsServices = require('../services/permissions')
		CountServices = require('../services/count')

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

		mockShortFromUUID = jest.fn()
		mockShortFromUUID.mockReturnValue('shortCollectionUUID')
		mockShortToUUID = jest.fn()
		mockShortToUUID.mockReturnValue('longCollectionUUID')

		short = require('short-uuid')
		short.mockReturnValue({
			fromUUID: mockShortFromUUID,
			toUUID: mockShortToUUID
		})
	})

	const generateCookie = (type = 'module', path = 'dashboard', order = 'alphabetical') => {
		const expires = new Date()
		expires.setFullYear(expires.getFullYear() + 1)
		const commonCookieString = `expires=${expires.toUTCString()}; path=${path}`
		document.cookie = `${type}SortOrder=${order}; ${commonCookieString}`
	}

	test('get /dashboard sends the correct props to the Dashboard component', () => {
		expect.hasAssertions()

		CountServices.getUserModuleCount.mockResolvedValueOnce(5)

		CollectionSummary.fetchByUserId = jest.fn()
		CollectionSummary.fetchByUserId.mockResolvedValueOnce(mockCollectionSummary)

		DraftSummary.fetchAllInCollection = jest.fn()
		DraftSummary.fetchByUserId = jest.fn()
		DraftSummary.fetchRecentByUserId = jest.fn()

		DraftSummary.fetchRecentByUserId.mockResolvedValueOnce(mockModuleSummary)

		return request(app)
			.get('/dashboard')
			.set('cookie', [generateCookie()])
			.then(response => {
				expect(CountServices.getUserModuleCount).toHaveBeenCalledTimes(1)
				expect(CountServices.getUserModuleCount).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(CollectionSummary.fetchByUserId).toHaveBeenCalledTimes(1)
				expect(CollectionSummary.fetchByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(DraftSummary.fetchRecentByUserId).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchRecentByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(DraftSummary.fetchAllInCollection).not.toHaveBeenCalled()
				expect(DraftSummary.fetchByUserId).not.toHaveBeenCalled()

				expect(mockDashboardComponent).toHaveBeenCalledTimes(1)
				expect(mockDashboardComponentConstructor).toHaveBeenCalledWith({
					title: 'Dashboard',
					collection: {
						id: null,
						title: null
					},
					currentUser: mockCurrentUser,
					mode: MODE_RECENT,
					moduleCount: 5,
					moduleSortOrder: 'last_updated',
					collectionSortOrder: 'alphabetical',
					myCollections: mockCollectionSummary,
					myModules: mockModuleSummary
				})
				expect(response.statusCode).toBe(200)
			})
	})

	test('get /dashboard/all sends the correct props to the Dashboard component with cookies set', () => {
		expect.hasAssertions()

		CountServices.getUserModuleCount.mockResolvedValueOnce(5)

		CollectionSummary.fetchByUserId = jest.fn()
		CollectionSummary.fetchByUserId.mockResolvedValueOnce(mockCollectionSummary)

		DraftSummary.fetchAllInCollection = jest.fn()
		DraftSummary.fetchByUserId = jest.fn()
		DraftSummary.fetchRecentByUserId = jest.fn()

		DraftSummary.fetchByUserId.mockResolvedValueOnce(mockModuleSummary)

		return request(app)
			.get('/dashboard/all')
			.set('cookie', [generateCookie()])
			.then(response => {
				expect(CountServices.getUserModuleCount).toHaveBeenCalledTimes(1)
				expect(CountServices.getUserModuleCount).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(CollectionSummary.fetchByUserId).toHaveBeenCalledTimes(1)
				expect(CollectionSummary.fetchByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(DraftSummary.fetchByUserId).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchByUserId).toHaveBeenCalledWith(mockCurrentUser.id)

				expect(DraftSummary.fetchAllInCollection).not.toHaveBeenCalled()
				expect(DraftSummary.fetchRecentByUserId).not.toHaveBeenCalled()

				expect(mockDashboardComponent).toHaveBeenCalledTimes(1)
				expect(mockDashboardComponentConstructor).toHaveBeenCalledWith({
					title: 'Dashboard',
					collection: {
						id: null,
						title: null
					},
					currentUser: mockCurrentUser,
					mode: MODE_ALL,
					moduleCount: 5,
					moduleSortOrder: 'alphabetical',
					collectionSortOrder: 'alphabetical',
					myCollections: mockCollectionSummary,
					myModules: mockModuleSummary
				})
				expect(response.statusCode).toBe(200)
			})
	})
})

jest.mock('../models/collection')
jest.mock('../models/draft_summary')
jest.mock('obojobo-express/server/models/user')
jest.mock('../models/draft_permissions')
jest.mock('trianglify')
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
jest.mock('react-modal')

jest.setTimeout(10000) // extend test timeout?

const publicLibCollectionId = require('../../shared/publicLibCollectionId')

let trianglify

let Collection
let DraftSummary
let UserModel
let DraftPermissions

// override requireCurrentUser for tests to provide our own user
let mockCurrentUser

jest.mock('obojobo-express/server/express_current_user', () => (req, res, next) => {
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
app.use('/', require('obojobo-repository/server/routes/library'))

describe('repository library route', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		mockCurrentUser = {
			id: 99,
			perms: []
		}
		trianglify = require('trianglify')
		trianglify.mockReturnValue({
			toSVG: jest.fn().mockReturnValue('mockTrianglifySVGInnerHTML')
		})

		Collection = require('../models/collection')
		DraftSummary = require('../models/draft_summary')
		UserModel = require('obojobo-express/server/models/user')
		DraftPermissions = require('../models/draft_permissions')
	})

	const expectPageTitleToBe = (response, title) => {
		expect(response.text).toContain(`<title>${title}</title>`)
	}

	test('get / returns the expected response', () => {
		expect.hasAssertions()

		return request(app)
			.get('/')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expectPageTitleToBe(response, 'Obojobo™ Next - Next Generation Course Content for your LMS')
			})
	})

	test('/library/module-icon/:moduleId returns the expected response with no headers', () => {
		expect.hasAssertions()

		return request(app)
			.get('/library/module-icon/mockDraftId')
			.then(response => {
				expect(trianglify).toHaveBeenCalled()
				expect(trianglify).toHaveBeenCalledWith({
					width: expect.any(Number),
					height: expect.any(Number),
					cellSize: expect.any(Number),
					variance: expect.any(Number),
					xColors: expect.any(String),
					strokeWidth: expect.any(Number),
					seed: expect.anything()
				})
				expect(trianglify().toSVG).toHaveBeenCalledTimes(1)
				expect(response.statusCode).toBe(200)
				expect(response.headers).toHaveProperty('etag', 'mockDraftId')
				expect(response.headers).toHaveProperty('content-type')
				expect(response.headers['content-type']).toContain('image/svg+xml')
				//res.send will actually send a string buffer
				expect(response.body).toBeInstanceOf(Buffer)
				const bodyString = response.body.toString()
				expect(bodyString).toContain('<svg')
				expect(bodyString).toContain('mockTrianglifySVGInnerHTML')
			})
	})

	test('/library/module-icon/:moduleId returns the expected response with certain headers', () => {
		expect.hasAssertions()

		const mockRequestHeaders = {}
		mockRequestHeaders['if-none-match'] = 'mockDraftId'

		return request(app)
			.get('/library/module-icon/mockDraftId')
			.set(mockRequestHeaders)
			.then(response => {
				expect(trianglify).not.toHaveBeenCalled()
				expect(response.statusCode).toBe(304)
				expect(response.body).toEqual({})
			})
	})

	test('get /login returns the expected response', () => {
		expect.hasAssertions()

		return request(app)
			.get('/login')
			.then(response => {
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expectPageTitleToBe(response, 'Log in to ObojoboNext')
			})
	})

	test('get /library returns the expected response', () => {
		expect.hasAssertions()

		const mockLoadRelatedDrafts = jest.fn()

		const mockCollection = {
			id: 'mockCollectionId',
			title: 'mockCollectionTitle',
			loadRelatedDrafts: mockLoadRelatedDrafts,
			drafts: [{ draftId: 'mockDraftId', title: 'mockDraftTitle' }]
		}

		mockLoadRelatedDrafts.mockResolvedValueOnce(mockCollection)

		Collection.fetchById = jest.fn()
		Collection.fetchById.mockResolvedValueOnce(mockCollection)

		return request(app)
			.get('/library')
			.then(response => {
				expect(Collection.fetchById).toHaveBeenCalledTimes(1)
				expect(Collection.fetchById).toHaveBeenCalledWith(publicLibCollectionId)
				expect(mockLoadRelatedDrafts).toHaveBeenCalledTimes(1)

				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expectPageTitleToBe(response, 'Obojobo Module Library')
			})
	})

	test('get /library/:draftId returns the expected response when draft exists and user owns it', () => {
		expect.hasAssertions()

		const mockDraft = {
			userId: 99,
			draftId: 'mockDraftId',
			title: 'mockDraftTitle'
		}

		const mockUser = {
			id: 99,
			firstName: 'mockUserFirstName',
			lastName: 'mockUserLastName'
		}

		DraftSummary.fetchById = jest.fn()
		DraftSummary.fetchById.mockResolvedValueOnce(mockDraft)

		UserModel.fetchById = jest.fn()
		UserModel.fetchById.mockResolvedValueOnce(mockUser)

		DraftPermissions.userHasPermissionToCopy.mockResolvedValueOnce(true)

		return request(app)
			.get(`/library/${publicLibCollectionId}`)
			.then(response => {
				expect(DraftSummary.fetchById).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchById).toHaveBeenCalledWith(publicLibCollectionId)
				expect(UserModel.fetchById).toHaveBeenCalledTimes(1)
				expect(UserModel.fetchById).toHaveBeenCalledWith(99)
				expect(DraftPermissions.userHasPermissionToCopy).toHaveBeenCalledTimes(1)
				expect(DraftPermissions.userHasPermissionToCopy).toHaveBeenCalledWith(
					mockCurrentUser,
					'mockDraftId'
				)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expectPageTitleToBe(response, 'mockDraftTitle - an Obojobo Module')
			})
	})

	test('get /library/:draftId returns the expected response when draft does not exist', () => {
		expect.hasAssertions()

		DraftSummary.fetchById = jest.fn()
		DraftSummary.fetchById.mockRejectedValueOnce(new Error('database error'))

		UserModel.fetchById = jest.fn()

		return request(app)
			.get(`/library/${publicLibCollectionId}`)
			.then(response => {
				expect(DraftSummary.fetchById).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchById).toHaveBeenCalledWith(publicLibCollectionId)
				expect(UserModel.fetchById).not.toHaveBeenCalled()
				expect(DraftPermissions.userHasPermissionToCopy).not.toHaveBeenCalled()
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(404)
			})
	})

	test('get /library/:draftId catches unexpected errors', () => {
		expect.hasAssertions()

		const mockDraft = {
			userId: 99,
			draftId: 'mockDraftId',
			title: 'mockDraftTitle'
		}

		DraftSummary.fetchById = jest.fn()
		DraftSummary.fetchById.mockResolvedValueOnce(mockDraft)

		UserModel.fetchById = jest.fn()
		UserModel.fetchById.mockRejectedValueOnce(new Error('database error'))

		return request(app)
			.get(`/library/${publicLibCollectionId}`)
			.then(response => {
				expect(DraftSummary.fetchById).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchById).toHaveBeenCalledWith(publicLibCollectionId)
				expect(UserModel.fetchById).toHaveBeenCalledTimes(1)
				expect(UserModel.fetchById).toHaveBeenCalledWith(99)
				expect(DraftPermissions.userHasPermissionToCopy).not.toHaveBeenCalled()
				expect(response.statusCode).toBe(500)
				expect(response.error).toHaveProperty('text', 'Server Error: database error')
			})
	})

	test('get /library/:draftId returns the expected response when draft is owned by user 0', () => {
		expect.hasAssertions()

		const mockDraft = {
			userId: '0',
			draftId: 'mockDraftId',
			title: 'mockDraftTitle'
		}

		const mockUser = {
			id: 99,
			firstName: 'mockUserFirstName',
			lastName: 'mockUserLastName'
		}

		DraftSummary.fetchById = jest.fn()
		DraftSummary.fetchById.mockResolvedValueOnce(mockDraft)

		UserModel.fetchById = jest.fn()
		UserModel.fetchById.mockResolvedValueOnce(mockUser)

		DraftPermissions.userHasPermissionToCopy.mockResolvedValueOnce(true)

		return request(app)
			.get(`/library/${publicLibCollectionId}`)
			.then(response => {
				expect(DraftSummary.fetchById).toHaveBeenCalledTimes(1)
				expect(DraftSummary.fetchById).toHaveBeenCalledWith(publicLibCollectionId)
				expect(UserModel.fetchById).not.toHaveBeenCalled()
				expect(DraftPermissions.userHasPermissionToCopy).toHaveBeenCalledWith(
					mockCurrentUser,
					'mockDraftId'
				)
				expect(response.header['content-type']).toContain('text/html')
				expect(response.statusCode).toBe(200)
				expectPageTitleToBe(response, 'mockDraftTitle - an Obojobo Module')
			})
	})
})

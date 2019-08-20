import MediaModel from '../../../models/media'

jest.mock('../../../models/media')
jest.mock('../../../models/user')
jest.mock('../../../db')
jest.mock('../../../logger')
jest.mock('../../../config', () => {
	return {
		media: {
			allowedMimeTypesRegex: 'jpeg|jpg|png|gif|svg',
			maxUploadSize: 100000,
			originalMediaTag: 'original',
			minImageSize: 10,
			maxImageSize: 8000,
			presetDimensions: {
				small: {
					width: 336,
					height: 252
				},
				medium: {
					width: 709,
					height: 532
				},
				large: {
					width: 821,
					height: 616
				}
			},
			tempUploadDestination: './tmp/media'
		}
	}
})

const mediaConfig = require('../../../config').media

// Mocks multerUpload with no errors
const mockMulterUpload = jest.fn().mockImplementation((req, res, cb) => {
	cb(null)
})

const mockMulterDiskStorage = jest.fn()
const mockMulter = jest.fn().mockImplementation(() => {
	return {
		single: () => mockMulterUpload
	}
})

jest.mock('multer', () => {
	const multer = mockMulter

	multer.diskStorage = mockMulterDiskStorage

	return multer
})

// don't use our existing express mock, we're using supertest
jest.unmock('express')

// Load an example default Obojobo middleware
const db = oboRequire('db')
const express = require('express')
const media = oboRequire('routes/api/media')
const request = require('supertest')

const app = express()
app.use(oboRequire('express_current_user'))

let mockCurrentUser

const mockGetCurrentUser = jest.fn().mockImplementation(req => {
	req.currentUser = mockCurrentUser
	return Promise.resolve(mockCurrentUser)
})

jest.mock('../../../express_current_user', () => (req, res, next) => {
	req.getCurrentUser = mockGetCurrentUser.bind(this, req)
	req.requireCurrentUser = mockGetCurrentUser.bind(this, req)
	next()
})

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(oboRequire('express_current_user'))
app.use('/', oboRequire('express_response_decorator'))
app.use('/api/media', media)

describe('api media route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.clearAllMocks()
		db.none.mockReset()
		db.any.mockReset()
	})
	afterEach(() => {})

	test('POST /api/media/upload returns the results of MediaModel.createAndSave', () => {
		const mockCreateAndSaveResults = { mockResults: true }
		mockCurrentUser = { id: 99 } // mock current logged in user
		MediaModel.createAndSave = jest.fn().mockResolvedValueOnce(mockCreateAndSaveResults)

		return request(app)
			.post('/api/media/upload')
			.then(response => {
				expect(mockMulterUpload).toHaveBeenCalled()
				expect(mockMulterDiskStorage).toBeCalledWith({
					destination: mediaConfig.tempUploadDestination
				})
				expect(response.body).toEqual(mockCreateAndSaveResults)
			})
	})

	test('POST /api/media/upload catches error from Multer', () => {
		const mockCreateAndSaveResults = { mockResults: true }
		mockCurrentUser = { id: 99 } // mock current logged in user

		MediaModel.createAndSave = jest.fn().mockResolvedValueOnce(mockCreateAndSaveResults)

		// multerUpload encounters error
		mockMulterUpload.mockImplementationOnce((req, res, cb) => {
			cb('Mock Multer Error')
		})

		return request(app)
			.post('/api/media/upload')
			.then(response => {
				expect(mockMulterUpload).toHaveBeenCalled()
				expect(response.statusCode).toBe(500)
				expect(response.text).toContain('Mock Multer Error')
			})
	})

	test('GET api/media/:id/:dimensions', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user

		MediaModel.fetchByIdAndDimensions = jest.fn().mockResolvedValueOnce({
			mimeType: 'text/html',
			binaryData: 'mockBinaryImageData'
		})

		return request(app)
			.get('/api/media/mockMediaId/8675x309')
			.then(response => {
				expect(MediaModel.fetchByIdAndDimensions).toBeCalledWith('mockMediaId', '8675x309')
				expect(response.text).toBe('mockBinaryImageData')
			})
	})
})

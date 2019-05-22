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

const mockMulterUpload = jest.fn().mockImplementation((req, res, cb) => {
	// Mocks multerUpload with no errors
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
		db.none.mockReset()
		db.any.mockReset()
	})
	afterEach(() => {})

	test('POST /api/media/upload works normally', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user

		MediaModel.createAndSave = jest
			.fn()
			.mockResolvedValueOnce('82ecb67a-7d2f-4785-a0b2-61cba30fa6eb')

		MediaModel.isValidFileType = jest.fn()

		MediaModel.isValidFileType.mockImplementationOnce(() => {
			return true
		})

		MediaModel.isValidFileType.mockImplementationOnce(() => {
			return false
		})

		return request(app)
			.post('/api/media/upload')
			.then(response => {
				expect(mockMulterUpload).toHaveBeenCalled()
				expect(mockMulterDiskStorage).toBeCalledWith({
					destination: mediaConfig.tempUploadDestination
				})
				expect(response.body).toEqual({ mediaId: '82ecb67a-7d2f-4785-a0b2-61cba30fa6eb' })
			})
	})

	test('POST /api/media/upload catches error from Multer', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user

		MediaModel.createAndSave = jest
			.fn()
			.mockResolvedValueOnce('82ecb67a-7d2f-4785-a0b2-61cba30fa6eb')

		// multerUpload encounters error
		mockMulterUpload.mockImplementationOnce((req, res, cb) => {
			cb('An error from multer')
		})

		return request(app)
			.post('/api/media/upload')
			.then(response => {
				expect(mockMulterUpload).toHaveBeenCalled()
				expect(mockMulterDiskStorage).toBeCalledWith({
					destination: mediaConfig.tempUploadDestination
				})
				// @TODO: this should probably testing that it's a json formatted object
				expect(response.text).toContain('An error from multer')
			})
	})

	test('GET api/media/:id/:dimensions', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user

		MediaModel.fetchByIdAndDimensions = jest.fn().mockResolvedValueOnce({
			mimeType: 'text/html',
			binaryData: 'ImageData'
		})

		return request(app)
			.get('/api/media/id/100x100')
			.then(response => {
				expect(MediaModel.fetchByIdAndDimensions).toBeCalledWith('id', '100x100')
				expect(response.text).toBe('ImageData')
			})
	})

	test('GET api/media/filename/:mediaId', () => {
		MediaModel.fetchFileName = jest.fn().mockResolvedValueOnce({ file_name: 'mockFileName' })
		return request(app)
			.get('/api/media/filename/mockMediaId')
			.then(response => {
				expect(MediaModel.fetchFileName).toBeCalledWith('mockMediaId')
				expect(response.body).toEqual({ filename: 'mockFileName' })
			})
	})
})

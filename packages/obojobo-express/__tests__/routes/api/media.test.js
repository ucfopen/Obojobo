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

describe('api draft route', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.none.mockReset()
		db.any.mockReset()
	})
	afterEach(() => {})

	test('POST /api/media/upload works normally', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user
		//mockMulterUpload.mockResolvedValueOnce(Promise.resolve())
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

		const mockFileData = {
			originalname: 'mockOriginalName',
			mimetype: 'mockMimeType'
		}

		const mockCallBack = jest.fn()

		return request(app)
			.post('/api/media/upload')
			.then(response => {
				expect(mockMulterUpload).toHaveBeenCalled()
				expect(mockMulterDiskStorage).toBeCalledWith({
					destination: mediaConfig.tempUploadDestination
				})
				expect(response.text).toBe('82ecb67a-7d2f-4785-a0b2-61cba30fa6eb')

				// test the multer fileFilter
				mockMulter.mock.calls[0][0].fileFilter('mockRequest', mockFileData, mockCallBack)
				expect(MediaModel.isValidFileType).toBeCalledWith('mockOriginalName', 'mockMimeType')
				expect(mockCallBack).toBeCalledWith(null, true)

				mockMulter.mock.calls[0][0].fileFilter('mockRequest', mockFileData, mockCallBack)
				expect(MediaModel.isValidFileType).toBeCalledWith('mockOriginalName', 'mockMimeType')
				expect(mockCallBack).toBeCalledWith(
					'File upload only supports the following filetypes: jpeg, jpg, png, gif, svg',
					false
				)
			})
	})

	test('POST /api/media/upload catches error from Multer', () => {
		mockCurrentUser = { id: 99 } // mock current logged in user
		//mockMulterUpload.mockResolvedValueOnce(Promise.resolve())
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
				expect(response.text).toBe('An error from multer\n')
			})
	})
})

test('GET api/media/:id/:dimensions', () => {
	mockCurrentUser = { id: 99 } // mock current logged in user
	//multer.single = jest.fn();
	MediaModel.fetchByIdAndDimensions = jest.fn().mockResolvedValueOnce('ImageData')

	return request(app)
		.get('/api/media/id/100x100')
		.then(response => {
			expect(MediaModel.fetchByIdAndDimensions).toBeCalledWith('id', '100x100')

			expect(response.text).toBe('ImageData')
		})
})

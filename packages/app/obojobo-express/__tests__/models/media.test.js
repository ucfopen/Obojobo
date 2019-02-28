jest.mock('../../db')
jest.mock('../../config', () => {
	return {
		media: {
			allowedMimeTypesRegex: 'jpeg|jpg|png|gif|svg',
			maxUploadSize: 100000,
			minImageSize: 10,
			maxImageSize: 3000,
			originalMediaTag: 'original',
			presetDimensions: {
				small: {
					width: 332
				},
				medium: {
					width: 712
				},
				large: {
					width: 836
				}
			},
			tempUploadDestination: './tmp/media'
		}
	}
})
jest.mock('fs')
jest.mock('file-type')
jest.mock('is-svg')

const mockSharpResize = jest.fn()
jest.mock('sharp', () => () => {
	return {
		resize: mockSharpResize,
		metadata: () => ({
			size: 'mockSize',
			format: 'mockFormat',
			width: 400,
			height: 300
		})
	}
})

import fs from 'fs'
import fileType from 'file-type'
import isSvg from 'is-svg'
import MediaModel from '../../models/media'

require('../../config').media

const db = oboRequire('db')

describe('media model', () => {
	const mockUserId = 555
	const mockFileInfo = {
		fieldname: 'userImage',
		originalname: 'bambi-sleeping2.png',
		encoding: '7bit',
		mimetype: 'image/png',
		destination: './tmp/media',
		filename: '0d3fd1ddb4838ea8fc2a651804428f3a',
		path: 'tmp/media/0d3fd1ddb4838ea8fc2a651804428f3a',
		size: 75099
	}
	const mockFileBinaryData = new Buffer('testBinaryInformation')
	const mediaModelResize = MediaModel.resize
	const mediaModelParseCustom = MediaModel.parseCustomImageDimensions
	const mediaModelCacheImage = MediaModel.saveImageAtNewSize
	const mediaModelValidFileType = MediaModel.isValidFileType

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
		MediaModel.resize = mediaModelResize
		MediaModel.parseCustomImageDimensions = mediaModelParseCustom
		MediaModel.saveImageAtNewSize = mediaModelCacheImage
		MediaModel.isValidFileType = mediaModelValidFileType
	})
	afterEach(() => {})

	test('storeImageInDb identifies invalid arguments', () => {
		const args = {
			binary: 'mockBinary',
			size: 'mockSize',
			mimetype: 'mockMimeType',
			dimensions: 'mockDimensions',
			mode: 'mockMode',
			filename: null,
			userId: null,
			mediaId: null
		}

		const testInvalidBinaryArgument = argString => {
			const args = JSON.parse(argString)
			args.binary = null
			MediaModel.storeImageInDb(args)
		}

		// args is stringifies, so it can be passed by value and manipulated
		expect(testInvalidBinaryArgument.bind(this, JSON.stringify(args))).toThrowError(
			'One or more required arguments not provided.'
		)

		const testInvalidSizeArgument = argString => {
			const args = JSON.parse(argString)
			args.size = null
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidSizeArgument.bind(this, JSON.stringify(args))).toThrowError(
			'One or more required arguments not provided.'
		)

		const testInvalidMimetypeArgument = argString => {
			const args = JSON.parse(argString)
			args.mimetype = null
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidMimetypeArgument.bind(this, JSON.stringify(args))).toThrowError(
			'One or more required arguments not provided.'
		)

		const testInvalidDimensionsArgument = argString => {
			const args = JSON.parse(argString)
			args.dimensions = null
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidDimensionsArgument.bind(this, JSON.stringify(args))).toThrowError(
			'One or more required arguments not provided.'
		)

		const testInvalidModeArgument = argString => {
			const args = JSON.parse(argString)
			args.mode = null
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidModeArgument.bind(this, JSON.stringify(args))).toThrowError(
			'One or more required arguments not provided.'
		)

		// A null filename is only invalid if an original image is being inserted
		// resized images will keep the same file names as the originals
		const testInvalidFilenameArgument = argString => {
			const args = JSON.parse(argString)
			args.mode = 'modeInsertOriginalImage'
			args.userId = 'mockUserId'
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidFilenameArgument.bind(this, JSON.stringify(args))).toThrowError(
			'Inserting an original image, but no filename provided'
		)

		// A null userId is only invalid if an original image is being inserted
		// original images need to be linked to the user inserting the image
		const testInvalidUserIdArgument = argString => {
			const args = JSON.parse(argString)
			args.mode = 'modeInsertOriginalImage'
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidUserIdArgument.bind(this, JSON.stringify(args))).toThrowError(
			'Inserting an original image, but no user id provided'
		)

		// A null mediaId is only invalid if a resized image is being inserted
		// resized images need to be linked to the original image they are derived from
		const testInvalidMediaIdArgument = argString => {
			const args = JSON.parse(argString)
			args.mode = 'modeInsertResizedImage'
			MediaModel.storeImageInDb(args)
		}

		expect(testInvalidMediaIdArgument.bind(this, JSON.stringify(args))).toThrowError(
			'Inserting a resized image, but no media id of the original image provided'
		)
	})

	test('storeImageInDb correctly stores a new image', () => {
		db.one.mockResolvedValueOnce({ id: 'NEW_BINARY_ID' })
		db.one.mockResolvedValueOnce({ id: 'NEW_MEDIA_ID' })
		db.one.mockResolvedValueOnce({ media_id: 'NEW_MEDIA_ID' })

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockReturnValueOnce(mockFileBinaryData)

		const mockArgs = {
			binary: 'mockBinary',
			filename: 'mockFilename',
			size: 'mockSize',
			mimetype: 'mockMimeType',
			dimensions: 'mockDimensions',
			mode: 'modeInsertOriginalImage',
			userId: 'mockUserId',
			mediaId: null
		}

		MediaModel.storeImageInDb(mockArgs).then(mediaRecord => {
			expect(db.one).toBeCalledTimes(3)

			// check second arg passed to the first call of transactionDB.one()
			// the first call adds the media binary information into the binaries db table
			expect(db.one.mock.calls[0][1]).toMatchObject({
				binary: 'mockBinary',
				size: 'mockSize',
				mimetype: 'mockMimeType'
			})

			// check second arg passed to the second call of transactionDB.one()
			// the second call adds media metadata, including user ownership, to media db table
			expect(db.one.mock.calls[1][1]).toMatchObject({
				filename: 'mockFilename',
				userId: 'mockUserId'
			})

			// check second arg passed to the third call of transactionDB.one()
			// the third call links the media metadata to the media binary through the media_binaries db table
			expect(db.one.mock.calls[2][1]).toMatchObject({
				dimensions: 'mockDimensions',
				mediaBinariesId: 'NEW_BINARY_ID',
				mediaRecordId: 'NEW_MEDIA_ID'
			})

			expect(mediaRecord.media_id).toEqual('NEW_MEDIA_ID')
		})
	})

	test('storeImageInDb correctly stores a resized image', () => {
		db.one.mockResolvedValueOnce({ id: 'NEW_BINARY_ID' })
		db.one.mockResolvedValueOnce({ media_id: 'mockMediaId' })

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockReturnValueOnce(mockFileBinaryData)

		const mockArgs = {
			binary: 'mockBinary',
			filename: 'mockFilename',
			size: 'mockSize',
			mimetype: 'mockMimeType',
			dimensions: 'mockDimensions',
			mode: 'modeInsertResizedImage',
			userId: null,
			mediaId: 'mockMediaId'
		}

		MediaModel.storeImageInDb(mockArgs).then(mediaRecord => {
			// A record in the media table already exists when inserting
			// a resized image, so there is on database query to insert
			// a media record
			expect(db.one).toBeCalledTimes(2)

			// check second arg passed to the first call of transactionDB.one()
			// the first call adds the media binary information into the binaries db table
			expect(db.one.mock.calls[0][1]).toMatchObject({
				binary: 'mockBinary',
				size: 'mockSize',
				mimetype: 'mockMimeType'
			})

			// check second arg passed to the second call of transactionDB.one()
			// the second call links the media metadata to the media binary through the media_binaries db table
			expect(db.one.mock.calls[1][1]).toMatchObject({
				dimensions: 'mockDimensions',
				mediaBinariesId: 'NEW_BINARY_ID',
				mediaRecordId: 'mockMediaId'
			})

			expect(mediaRecord.media_id).toEqual('mockMediaId')
		})
	})

	test('createAndSave calls storeImageInDB with correct arguments', () => {
		const mockNewMediaRecord = {
			media_id: 'MEDIA_UUID',
			binary_id: 'BINARY_UUID',
			dimensions: 'original'
		}

		MediaModel.storeImageInDb = jest.fn()
		MediaModel.storeImageInDb.mockImplementationOnce(() => {
			return Promise.resolve(mockNewMediaRecord)
		})

		MediaModel.isValidFileType = jest.fn()
		MediaModel.isValidFileType.mockImplementationOnce(() => {
			return true
		})

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockImplementation(() => {
			return mockFileBinaryData
		})

		return MediaModel.createAndSave(mockUserId, mockFileInfo).then(mediaId => {
			expect(MediaModel.storeImageInDb).toBeCalledTimes(1)

			// Check arguments being passed to storeImageInDb
			expect(MediaModel.storeImageInDb).toHaveBeenCalledWith({
				binary: mockFileBinaryData,
				size: 75099,
				mimetype: 'image/png',
				dimensions: 'original',
				mode: 'modeInsertOriginalImage',
				filename: 'bambi-sleeping2.png',
				mediaId: null,
				userId: mockUserId
			})

			// Check that the correct value is being returned to the route
			expect(mediaId).toEqual(mockNewMediaRecord.media_id)
		})
	})

	test('createAndSave correctly catches errors from readFileSync', () => {
		expect.assertions(3)

		MediaModel.storeImageInDb = jest.fn()

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockImplementationOnce(() => {
			throw new Error('Mock error from readFileSync')
		})

		return MediaModel.createAndSave(mockUserId, mockFileInfo)
			.then(() => {
				// this line should not be executed because an error should be thrown and caught from readFileSync
				expect('this').toBe('not called')
			})
			.catch(e => {
				expect(e).not.toBeNull()
				expect(e.message).toBe('Mock error from readFileSync')
				expect(e).toBeInstanceOf(Error)
			})
	})

	test('createAndSave correctly throws error on invalid file types', () => {
		expect.assertions(4)

		MediaModel.storeImageInDb = jest.fn()

		MediaModel.isValidFileType = jest.fn()
		MediaModel.isValidFileType.mockImplementationOnce(() => {
			return false
		})

		return MediaModel.createAndSave(mockUserId, mockFileInfo)
			.then(() => {
				// this line should not be executed because an error should be thrown and caught from readFileSync
				expect('this').toBe('not called')
			})
			.catch(e => {
				expect(fs.unlinkSync).toHaveBeenCalled()
				expect(e).not.toBeNull()
				expect(e.message).toBe(
					'File upload only supports the following filetypes: jpeg, jpg, png, gif, svg'
				)
				expect(e).toBeInstanceOf(Error)
			})
	})

	test('createAndSave correctly catches errors from storeImageInDb', () => {
		expect.assertions(3)

		MediaModel.isValidFileType = jest.fn()
		MediaModel.isValidFileType.mockImplementationOnce(() => {
			return true
		})

		MediaModel.storeImageInDb = jest.fn()
		MediaModel.storeImageInDb.mockImplementationOnce(() => {
			return Promise.reject(new Error('Mock error from storeImageInDb'))
		})

		fs.readFileSync = jest.fn()

		return MediaModel.createAndSave(mockUserId, mockFileInfo)
			.then(() => {
				// this line should not be executed because an error should be thrown and caught from readFileSync
				expect('this').toBe('not called')
			})
			.catch(e => {
				expect(e).not.toBeNull()
				expect(e.message).toBe('Mock error from storeImageInDb')
				expect(e).toBeInstanceOf(Error)
			})
	})

	test('saveImageAtNewSize calls MediaModel with correct arguments', async () => {
		const mockNewMediaRecord = {
			media_id: 'MEDIA_UUID',
			binary_id: 'BINARY_UUID',
			dimensions: 'small'
		}
		const mockImageBinary = new Buffer('image')
		const mockImageDimensions = 'small'
		const mockOriginalImageId = 'SOME_UUID'
		const mockResizedBinary = jest.fn()

		MediaModel.resize = jest.fn().mockReturnValueOnce(mockResizedBinary)
		MediaModel.storeImageInDb = jest.fn().mockResolvedValueOnce(mockNewMediaRecord)

		const newImageInfo = await MediaModel.saveImageAtNewSize(
			mockOriginalImageId,
			mockImageBinary,
			mockImageDimensions
		)

		// Expect newImageInfo to return the results of sharp.metadata()
		expect(newImageInfo).toEqual({
			metadata: {
				format: 'mockFormat',
				size: 'mockSize',
				width: 400,
				height: 300
			},
			binary: mockResizedBinary
		})
		expect(MediaModel.storeImageInDb).toBeCalledTimes(1)
		expect(MediaModel.storeImageInDb).toHaveBeenCalledWith({
			binary: mockResizedBinary,
			size: 'mockSize',
			mimetype: 'image/mockFormat',
			dimensions: 'small',
			mode: 'modeInsertResizedImage',
			mediaId: 'SOME_UUID',
			userId: null
		})
	})

	test('fetchByIdAndDimensions throws error if no images returned from db', async () => {
		const mockResults = []

		db.manyOrNone.mockResolvedValueOnce(mockResults)

		expect.assertions(1)

		try {
			await MediaModel.fetchByIdAndDimensions('SOME_UUID', 'original')
		} catch (e) {
			expect(e.message).toBe('Image not found')
		}
	})

	test('fetchByIdAndDimensions throws error if original size is not found', async () => {
		const mockResults = [
			{
				dimensions: 'some-size',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		db.manyOrNone.mockResolvedValueOnce(mockResults)

		expect.assertions(1)

		try {
			await MediaModel.fetchByIdAndDimensions('SOME_UUID', 'original')
		} catch (e) {
			expect(e.message).toBe('Original image size not found')
		}
	})

	test('fetchByIdAndDimensions retrieves original media when given correct size format', () => {
		const mockResults = [
			{
				dimensions: 'original',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		const spy = jest.spyOn(MediaModel, 'saveImageAtNewSize')
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'original').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({
				binaryData: mockFileBinaryData,
				mimeType: 'mockMimeType'
			})
			expect(spy).not.toHaveBeenCalled()
			spy.mockRestore()
		})
	})

	test('fetchByIdAndDimensions retrieves requested media when given correct size format', () => {
		const mockResults = [
			{
				dimensions: 'original'
			},
			{
				dimensions: 'some-size',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		const spy = jest.spyOn(MediaModel, 'saveImageAtNewSize')
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'some-size').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({ binaryData: mockFileBinaryData, mimeType: 'mockMimeType' })
			expect(spy).not.toHaveBeenCalled()
			spy.mockRestore()
		})
	})

	test('fetchByIdAndDimensions retrieves large size media when not given a size', () => {
		const mockResults = [
			{ dimensions: 'original' },
			{
				dimensions: 'large',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		const spy = jest.spyOn(MediaModel, 'saveImageAtNewSize')
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({ binaryData: mockFileBinaryData, mimeType: 'mockMimeType' })
			expect(spy).not.toHaveBeenCalled()
			spy.mockRestore()
		})
	})

	test('fetchByIdAndDimensions retrieves original media when asking for a type of media that should not be resized', () => {
		const mockResults = [
			{
				dimensions: 'original',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'image/svg+xml',
				blob: mockFileBinaryData
			}
		]

		const spy = jest.spyOn(MediaModel, 'saveImageAtNewSize')
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'some-size').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({ binaryData: mockFileBinaryData, mimeType: 'image/svg+xml' })
			expect(spy).not.toHaveBeenCalled()
			spy.mockRestore()
		})
	})

	test('fetchByIdAndDimensions retrieves original media when asking for a new size of media that is larger than the original', () => {
		const mockResults = [
			{
				dimensions: 'original',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		const shouldResizeMediaSpy = jest
			.spyOn(MediaModel, 'shouldResizeMedia')
			.mockResolvedValueOnce(false)
		const saveImageAtNewSizeSpy = jest.spyOn(MediaModel, 'saveImageAtNewSize')
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'some-size').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({ binaryData: mockFileBinaryData, mimeType: 'mockMimeType' })
			expect(saveImageAtNewSizeSpy).not.toHaveBeenCalled()
			shouldResizeMediaSpy.mockRestore()
			saveImageAtNewSizeSpy.mockRestore()
		})
	})

	test('fetchByIdAndDimensions resizes media when asking for a new size of media which is smaller than the original', () => {
		const mockResults = [
			{
				dimensions: 'original',
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				mime_type: 'mockMimeType',
				blob: mockFileBinaryData
			}
		]

		const shouldResizeMediaSpy = jest
			.spyOn(MediaModel, 'shouldResizeMedia')
			.mockResolvedValueOnce(true)
		const saveImageAtNewSizeSpy = jest
			.spyOn(MediaModel, 'saveImageAtNewSize')
			.mockImplementation(() => ({
				binary: 'mockResizedBinary',
				metadata: { format: 'mock-mime-type' }
			}))
		db.manyOrNone.mockResolvedValueOnce(mockResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'small').then(imageData => {
			// An image's binary data is returned to the editor when an image is requested
			expect(imageData).toEqual({
				binaryData: 'mockResizedBinary',
				mimeType: 'image/mock-mime-type'
			})
			expect(saveImageAtNewSizeSpy).toHaveBeenCalled()
			shouldResizeMediaSpy.mockRestore()
			saveImageAtNewSizeSpy.mockRestore()
		})
	})

	test('parseCustomImageDimensions correctly parses valid dimensions string, no wildcards', () => {
		const dimensionsString = '100x100'
		const parsedDimensionsString = MediaModel.parseCustomImageDimensions(dimensionsString)
		const expectedDimensionObject = {
			width: 100,
			height: 100
		}

		expect(parsedDimensionsString).toMatchObject(expectedDimensionObject)
	})

	test('parseCustomImageDimensions correctly parses valid dimensions string, width wildcard', () => {
		const dimensionsString = '*x100'
		const parsedDimensionsString = MediaModel.parseCustomImageDimensions(dimensionsString)
		const expectedDimensionObject = {
			height: 100
		}

		expect(parsedDimensionsString).toMatchObject(expectedDimensionObject)
	})

	test('parseCustomImageDimensions correctly parses valid dimensions string, height wildcard', () => {
		const dimensionsString = '100x*'
		const parsedDimensionsString = MediaModel.parseCustomImageDimensions(dimensionsString)
		const expectedDimensionObject = {
			width: 100
		}

		expect(parsedDimensionsString).toMatchObject(expectedDimensionObject)
	})

	test('parseCustomImageDimensions enforces min size configuration', () => {
		const dimensionsString = '1x1'
		const parsedDimensionsString = MediaModel.parseCustomImageDimensions(dimensionsString)
		const expectedDimensionObject = {
			width: 10,
			height: 10
		}

		expect(parsedDimensionsString).toMatchObject(expectedDimensionObject)
	})

	test('parseCustomImageDimensions enforces max size configuration', () => {
		const dimensionsString = '10000x10000'
		const parsedDimensionsString = MediaModel.parseCustomImageDimensions(dimensionsString)
		const expectedDimensionObject = {
			width: 3000,
			height: 3000
		}

		expect(parsedDimensionsString).toMatchObject(expectedDimensionObject)
	})

	test('parseCustomImageDimensions throws Error on invalid dimensions string', () => {
		let dimensionsString

		// Split into 1 section
		dimensionsString = '100*'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)

		// Split into 2 sections
		dimensionsString = '100x100x100'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)

		// Split into 2 sections
		dimensionsString = '*x*'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})

	test('parseCustomImageDimensions throws Error on NaN width', () => {
		const dimensionsString = 'widthx100'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})

	test('parseCustomImageDimensions throws Error on NaN height', () => {
		const dimensionsString = '100xheight'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})

	test('resize calls sharp.resize correctly when given width only', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = {
			width: 200,
			height: undefined, //eslint-disable-line no-undefined
			fit: 'cover'
		}

		mockSharpResize.mockImplementationOnce(() => {
			return {
				toBuffer: () => jest.fn()
			}
		})

		MediaModel.resize(mockBuffer, { width: 200 })

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('resize calls sharp.resize correctly when given height only', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = {
			width: undefined, //eslint-disable-line no-undefined
			height: 100,
			fit: 'cover'
		}

		mockSharpResize.mockImplementationOnce(() => {
			return { toBuffer: () => jest.fn() }
		})

		MediaModel.resize(mockBuffer, { height: 100 })

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('resize calls sharp.resize correctly when given width and height', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = { width: 200, height: 100, fit: 'fill' }

		mockSharpResize.mockImplementationOnce(() => {
			return { toBuffer: () => jest.fn() }
		})

		MediaModel.resize(mockBuffer, { width: 200, height: 100 })

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('isValidFileType returns false if file-type library returns null', () => {
		fileType.mockImplementationOnce(() => {
			return null
		})

		const isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))

		expect(isValidFile).toBeFalsy()
	})

	test('isValidFileType recognizes jpg and jpeg', () => {
		let isValidFile

		fileType.mockImplementationOnce(() => {
			return {
				ext: 'jpg'
			}
		})

		isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))
		expect(isValidFile).toBeTruthy()

		fileType.mockImplementationOnce(() => {
			return {
				ext: 'jpeg'
			}
		})

		isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes png', () => {
		fileType.mockImplementationOnce(() => {
			return {
				ext: 'png'
			}
		})

		const isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes gif', () => {
		fileType.mockImplementationOnce(() => {
			return {
				ext: 'gif'
			}
		})

		const isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes svg', () => {
		fileType.mockImplementationOnce(() => {
			return null
		})

		isSvg.mockImplementationOnce(() => {
			return true
		})

		const isValidFile = MediaModel.isValidFileType(new Buffer('TestImage'))
		expect(isSvg).toHaveBeenCalledWith(new Buffer('TestImage'))
		expect(isValidFile).toBeTruthy()
	})

	test('getDimensionValues returns expected values', () => {
		expect(MediaModel.getDimensionValues('small')).toEqual({ width: 332 })
		expect(MediaModel.getDimensionValues('medium')).toEqual({ width: 712 })
		expect(MediaModel.getDimensionValues('large')).toEqual({ width: 836 })
		expect(MediaModel.getDimensionValues('200x100')).toEqual({ width: 200, height: 100 })
		expect(MediaModel.getDimensionValues('200x*')).toEqual({ width: 200 })
		expect(MediaModel.getDimensionValues('*x100')).toEqual({ height: 100 })
	})

	test('shouldResizeMedia returns true if both dimensions given', async () => {
		MediaModel.getDimensionValues = jest.fn().mockReturnValueOnce({ width: 200, height: 100 })

		const shouldResizeMedia = await MediaModel.shouldResizeMedia(jest.fn(), 'some-dimensions')

		expect(shouldResizeMedia).toBe(true)
	})

	test('shouldResizeMedia returns true if new image width is smaller than the original image width', async () => {
		// Original image is 400x300 according to mock

		MediaModel.getDimensionValues = jest.fn().mockReturnValueOnce({ width: 200 })

		const shouldResizeMedia = await MediaModel.shouldResizeMedia(jest.fn(), 'some-dimensions')

		expect(shouldResizeMedia).toBe(true)
	})

	test('shouldResizeMedia returns true if new image height is smaller than the original image height', async () => {
		// Original image is 400x300 according to mock

		MediaModel.getDimensionValues = jest.fn().mockReturnValueOnce({ height: 200 })

		const shouldResizeMedia = await MediaModel.shouldResizeMedia(jest.fn(), 'some-dimensions')

		expect(shouldResizeMedia).toBe(true)
	})

	test('shouldResizeMedia returns false if new image width is larger than the original image width', async () => {
		// Original image is 400x300 according to mock

		MediaModel.getDimensionValues = jest.fn().mockReturnValueOnce({ width: 2000 })

		const shouldResizeMedia = await MediaModel.shouldResizeMedia(jest.fn(), 'some-dimensions')

		expect(shouldResizeMedia).toBe(false)
	})

	test('shouldResizeMedia returns false if new image height is larger than the original image height', async () => {
		// Original image is 400x300 according to mock

		MediaModel.getDimensionValues = jest.fn().mockReturnValueOnce({ height: 2000 })

		const shouldResizeMedia = await MediaModel.shouldResizeMedia(jest.fn(), 'some-dimensions')

		expect(shouldResizeMedia).toBe(false)
	})
})

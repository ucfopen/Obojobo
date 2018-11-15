jest.mock('../../db')
jest.mock('../../config', () => {
	return {
		media: {
			allowedMimeTypesRegex: 'jpeg|jpg|png|gif|svg',
			maxUploadSize: 100000,
			minImageSize: 10,
			maxImageSize: 8000,
			originalMediaTag: 'original',
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
				},
				tempUploadDestination: './tmp/media'
			}
		}
	}
})
jest.mock('fs')

const mockSharpResize = jest.fn()
jest.mock('sharp', () => () => {
	return {
		resize: mockSharpResize,
		metadata: () => ({
			size: 'mockSize',
			format: 'mockFormat'
		})
	}
})

import fs from 'fs'
import MediaModel from '../../models/media'

const mediaConfig = require('../../config').media

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
	const mediaModelCacheImage = MediaModel.cacheImageInDb

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
		MediaModel.resize = mediaModelResize
		MediaModel.parseCustomImageDimensions = mediaModelParseCustom
		MediaModel.cacheImageInDb = mediaModelCacheImage
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

	test('createAndSave calls MediaModel with correct arguments', () => {
		const mockNewMediaRecord = {
			media_id: 'MEDIA_UUID',
			binary_id: 'BINARY_UUID',
			dimensions: 'original'
		}

		MediaModel.storeImageInDb = jest.fn()
		MediaModel.storeImageInDb.mockImplementationOnce(() => {
			return Promise.resolve(mockNewMediaRecord)
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
		fs.readFileSync.mockImplementation(() => {
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

	test('createAndSave correctly catches errors from storeImageInDb', () => {
		expect.assertions(3)

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

	test('cacheImageInDb calls MediaModel with correct arguments', () => {
		const mockNewMediaRecord = {
			media_id: 'MEDIA_UUID',
			binary_id: 'BINARY_UUID',
			dimensions: 'small'
		}

		const mockImageBinary = new Buffer('image')
		const mockImageMetadata = {
			size: 'mockSize',
			format: 'mockFormat'
		}
		const mockImageDimensions = 'small'
		const mockOriginalImageId = 'SOME_UUID'

		MediaModel.storeImageInDb = jest.fn()
		MediaModel.storeImageInDb.mockImplementationOnce(() => {
			return Promise.resolve(mockNewMediaRecord)
		})

		return MediaModel.cacheImageInDb(
			mockImageBinary,
			mockImageMetadata,
			mockImageDimensions,
			mockOriginalImageId
		).then(newMediaRecordId => {
			expect(MediaModel.storeImageInDb).toBeCalledTimes(1)

			expect(MediaModel.storeImageInDb).toHaveBeenCalledWith({
				binary: mockImageBinary,
				size: 'mockSize',
				mimetype: 'image/mockFormat',
				dimensions: 'small',
				mode: 'modeInsertResizedImage',
				mediaId: 'SOME_UUID',
				userId: null
			})

			// Check that the correct value is being returned to the route
			expect(newMediaRecordId).toEqual(mockNewMediaRecord.media_id)
		})
	})

	test('cacheImageInDb catches errors from storeImageInDb', () => {
		expect.assertions(3)

		const mockImageBinary = new Buffer('image')
		const mockImageMetadata = {
			size: 'mockSize',
			format: 'mockFormat'
		}
		const mockImageDimensions = 'small'
		const mockOriginalImageId = 'SOME_UUID'

		MediaModel.storeImageInDb = jest.fn()
		MediaModel.storeImageInDb.mockImplementationOnce(() => {
			return Promise.reject(new Error('Mock error from storeImageInDb'))
		})

		return MediaModel.cacheImageInDb(
			mockImageBinary,
			mockImageMetadata,
			mockImageDimensions,
			mockOriginalImageId
		)
			.then(() => {
				expect('not').toBe('called')
			})
			.catch(err => {
				expect(err).not.toBeNull()
				expect(err.message).toBe('Mock error from storeImageInDb')
				expect(err).toBeInstanceOf(Error)
			})
	})

	test('fetchByIdAndDimensions retrieves existing media when given correct size format', () => {
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			}
		]
		const mockBinaryResult = {
			blob: mockFileBinaryData
		}

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'original').then(binaryData => {
			expect(db.tx).toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(mockFileBinaryData)
		})
	})

	test('fetchByIdAndDimensions resizes original media and caches the resized image', () => {
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			}
		]
		const mockBinaryResult = {
			blob: mockFileBinaryData
		}

		MediaModel.resize = jest.fn()
		MediaModel.cacheImageInDb = jest.fn()

		MediaModel.resize.mockResolvedValueOnce(new Buffer('resizedImage'))
		MediaModel.cacheImageInDb.mockResolvedValueOnce('SOME_UUID')

		// Mocks resolution of first query to media_binaries
		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)

		// Mocks resolution of first query to binaries
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('MEDIA_UUID', 'small').then(binaryData => {
			expect(db.tx).toBeCalled()

			expect(MediaModel.cacheImageInDb).toHaveBeenCalledWith(
				new Buffer('resizedImage'),
				{
					format: 'mockFormat',
					size: 'mockSize'
				},
				'small',
				'MEDIA_UUID'
			)
			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(new Buffer('resizedImage'))
		})
	})

	test('fetchByIdAndDimensions correctly identifies original image reference when returned as first item from media_binaries', () => {
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			},
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'small'
			}
		]

		const mockBinaryResult = {
			blob: mockFileBinaryData
		}

		MediaModel.resize = jest.fn()

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'small').then(binaryData => {
			expect(db.tx).toBeCalled()

			// Since a reference to small was returned from media_binaries, the original
			//  does not need to be resized
			expect(MediaModel.resize).not.toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(mockFileBinaryData)
		})
	})

	test('fetchByIdAndDimensions correctly identifies original image reference when returned as second item from media_binaries', () => {
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'small'
			},
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			}
		]

		const mockBinaryResult = {
			blob: mockFileBinaryData
		}

		MediaModel.resize = jest.fn()

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'small').then(binaryData => {
			expect(db.tx).toBeCalled()

			// Since a reference to small was returned from media_binaries, the original
			//  does not need to be resized
			expect(MediaModel.resize).not.toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(mockFileBinaryData)
		})
	})

	test('fetchByIdAndDimensions throws error when receiving no results from media_binaries table', () => {
		expect.assertions(1)

		const mockMediaBinaryResults = null

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID')
			.then(binaryData => {
				// this line should not be executed because an error should be thrown and caught with given input
				expect(binaryData).toBe('not set')
			})
			.catch(e => {
				expect(e).not.toBeNull()
			})
	})

	test('fetchByIdAndDimensions throws error when receiving more than 2 results from media_binaries', () => {
		expect.assertions(1)

		// The database should not be holding two images with both the same id and same dimensions
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			},
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'small'
			},
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'small'
			}
		]

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID')
			.then(binaryData => {
				// this line should not be executed because an error should be thrown and caught with given input
				expect(binaryData).toBe('not set')
			})
			.catch(e => {
				expect(e).not.toBeNull()
			})
	})

	test('fetchByIdAndDimensions defaults to large dimensions', () => {
		const mockMediaBinaryResults = [
			{
				media_id: 'MEDIA_UUID',
				binary_id: 'BINARY_UUID',
				dimensions: 'original'
			}
		]

		const mockBinaryResult = {
			blob: mockFileBinaryData
		}

		MediaModel.resize = jest.fn()
		MediaModel.cacheImageInDb = jest.fn()

		MediaModel.resize.mockResolvedValueOnce(new Buffer('resizedImage'))
		MediaModel.cacheImageInDb.mockResolvedValueOnce('SOME_UUID')

		// Mocks resolution of first query to media_binaries
		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)

		// Mocks resolution of first query to binaries
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('FETCHING_UUID').then(binaryData => {
			expect(db.tx).toBeCalled()

			expect(MediaModel.resize.mock.calls[0][1]).toEqual('large')

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(new Buffer('resizedImage'))
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

	test('parseCustomImageDimensions enforces max size configuration', () => {
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
			width: 8000,
			height: 8000
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

	test('resize correctly parses small dimensions and passes them to sharp', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = {
			width: mediaConfig.presetDimensions.small.width,
			height: mediaConfig.presetDimensions.small.height,
			fit: 'inside'
		}

		mockSharpResize.mockImplementationOnce(() => {
			return {
				toBuffer: () => jest.fn()
			}
		})

		MediaModel.resize(mockBuffer, 'small')

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('resize correctly parses medium dimensions and passes them to sharp', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = {
			width: mediaConfig.presetDimensions.medium.width,
			height: mediaConfig.presetDimensions.medium.height,
			fit: 'inside'
		}

		mockSharpResize.mockImplementationOnce(() => {
			return {
				toBuffer: () => jest.fn()
			}
		})

		MediaModel.resize(mockBuffer, 'medium')

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('resize correctly parses large dimensions and passes them to sharp', () => {
		const mockBuffer = new Buffer('some_image')
		const expectedDimensions = {
			width: mediaConfig.presetDimensions.large.width,
			height: mediaConfig.presetDimensions.large.height,
			fit: 'inside'
		}

		mockSharpResize.mockImplementationOnce(() => {
			return {
				toBuffer: () => jest.fn()
			}
		})

		MediaModel.resize(mockBuffer, 'large')

		expect(mockSharpResize).toBeCalledWith(expectedDimensions)
	})

	test('resize calls parseCustomImageDimensions when custom dimensions given', () => {
		const mockBuffer = new Buffer('some_image')

		mockSharpResize.mockImplementationOnce(() => {
			return {
				toBuffer: () => jest.fn()
			}
		})

		MediaModel.parseCustomImageDimensions = jest.fn()
		MediaModel.parseCustomImageDimensions.mockImplementationOnce(() => {
			return {
				height: 1,
				width: 1
			}
		})

		MediaModel.resize(mockBuffer, '100x200')

		expect(MediaModel.parseCustomImageDimensions).toBeCalledWith('100x200')
	})

	test('isValidFileType rejects invalid file types', () => {
		let isValidFile = MediaModel.isValidFileType('mockFilename.pdf', 'pdf')
		expect(isValidFile).toBeFalsy()

		isValidFile = MediaModel.isValidFileType('mockFilename.bin', 'bin')
		expect(isValidFile).toBeFalsy()

		isValidFile = MediaModel.isValidFileType('mockFilename.tiff', 'tiff')
		expect(isValidFile).toBeFalsy()
	})

	test('isValidFileType recognizes jpg and jpeg', () => {
		let isValidFile = MediaModel.isValidFileType('mockFilename.jpg', 'jpg')
		expect(isValidFile).toBeTruthy()

		isValidFile = MediaModel.isValidFileType('mockFilename.jpeg', 'jpeg')
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes png', () => {
		const isValidFile = MediaModel.isValidFileType('mockFilename.png', 'png')
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes gif', () => {
		const isValidFile = MediaModel.isValidFileType('mockFilename.gif', 'gif')
		expect(isValidFile).toBeTruthy()
	})

	test('isValidFileType recognizes svg', () => {
		const isValidFile = MediaModel.isValidFileType('mockFilename.svg', 'svg')
		expect(isValidFile).toBeTruthy()
	})
})

jest.mock('../../db')
jest.mock('../../config', () => {
	return {
		media: {
			maxUploadSize: 100000,
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
jest.mock('sharp', () => () => {
	return {
		resize: () => {
			return {
				toBuffer: () => new Buffer('resizedImage')
			}
		}
	}
})

import fs from 'fs'
import MediaModel from '../../models/media'

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

	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		db.one.mockReset()
	})
	afterEach(() => {})

	test('createAndSave inserts media with default dimensions into the database and returns the medias id', () => {
		db.one.mockResolvedValueOnce({ id: 'NEW_BINARY_ID' })
		db.one.mockResolvedValueOnce({ id: 'NEW_MEDIA_ID' })

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockReturnValueOnce(mockFileBinaryData)

		return MediaModel.createAndSave(mockUserId, mockFileInfo).then(mediaId => {
			expect(db.tx).toBeCalled()

			// check second arg passed to the first call of transactionDB.one()
			// the first call adds the media binary information into the binaries db table
			expect(db.one.mock.calls[0][1]).toEqual({
				file: mockFileBinaryData,
				file_size: mockFileInfo.size,
				mime_type: mockFileInfo.mimetype
			})

			// check second arg passed to the second call of transactionDB.one()
			// the second call adds media metadata, including user ownership, to media db table
			expect(db.one.mock.calls[1][1]).toEqual({
				filename: mockFileInfo.filename,
				userId: mockUserId
			})

			// check second arg passed to the third call of transactionDB.one()
			// the third call links the media metadata to the media binary through the media_binaries db table
			expect(db.one.mock.calls[2][1]).toEqual({
				dimensions: 'original',
				mediaBinariesId: 'NEW_BINARY_ID',
				mediaId: 'NEW_MEDIA_ID'
			})

			// Make sure the temporary media file is removed after the media is stored in the database
			expect(fs.unlinkSync).toBeCalled()

			// mediaId is returned to the editor when an image is added, and should be the ID of the user's media
			//  in the media db table. The editor retrieves an image based on mediaID
			expect(mediaId).toEqual('NEW_MEDIA_ID')
		})
	})

	test('createAndSave inserts media with specified dimenstions into the database and returns the medias id', () => {
		db.one.mockResolvedValueOnce({ id: 'NEW_BINARY_ID' })
		db.one.mockResolvedValueOnce({ id: 'NEW_MEDIA_ID' })

		fs.readFileSync = jest.fn()
		fs.readFileSync.mockReturnValueOnce(mockFileBinaryData)

		return MediaModel.createAndSave(mockUserId, mockFileInfo, 'small').then(mediaId => {
			expect(db.tx).toBeCalled()

			// check second arg passed to the first call of transactionDB.one()
			// the first call adds the media binary information into the binaries db table
			expect(db.one.mock.calls[0][1]).toEqual({
				file: mockFileBinaryData,
				file_size: mockFileInfo.size,
				mime_type: mockFileInfo.mimetype
			})

			// check second arg passed to the second call of transactionDB.one()
			// the second call adds media metadata, including user ownership, to media db table
			expect(db.one.mock.calls[1][1]).toEqual({
				filename: mockFileInfo.filename,
				userId: mockUserId
			})

			// check second arg passed to the third call of transactionDB.one()
			// the third call links the media metadata to the media binary through the media_binaries db table
			expect(db.one.mock.calls[2][1]).toEqual({
				dimensions: 'small',
				mediaBinariesId: 'NEW_BINARY_ID',
				mediaId: 'NEW_MEDIA_ID'
			})

			// Make sure the temporary media file is removed after the media is stored in the database
			expect(fs.unlinkSync).toBeCalled()

			// mediaId is returned to the editor when an image is added, and should be the ID of the user's media
			//  in the media db table. The editor retrieves an image based on mediaID
			expect(mediaId).toEqual('NEW_MEDIA_ID')
		})
	})

	test('createAndSave correctly catches errors', () => {
		expect.assertions(2)

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
				expect(e).toBeInstanceOf(Error)
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

	test('fetchByIdAndDimensions resizes original media and returns resized media when given new correct size format', () => {
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

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', '500x300').then(binaryData => {
			expect(db.tx).toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(new Buffer('resizedImage'))
		})
	})

	test('fetchByIdAndDimensions resizes original media to the small format', () => {
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

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'small').then(binaryData => {
			expect(db.tx).toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(new Buffer('resizedImage'))
		})
	})

	test('fetchByIdAndDimensions resizes original media to the medium format', () => {
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

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'medium').then(binaryData => {
			expect(db.tx).toBeCalled()

			// An image's binary data is returned to the editor when an image is requested
			expect(binaryData).toEqual(new Buffer('resizedImage'))
		})
	})

	test('fetchByIdAndDimensions resizes original media to the large format', () => {
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

		return MediaModel.fetchByIdAndDimensions('SOME_UUID', 'large').then(binaryData => {
			expect(db.tx).toBeCalled()

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
		MediaModel.resize.mockResolvedValueOnce(new Buffer('resizedImage'))

		db.manyOrNone.mockResolvedValueOnce(mockMediaBinaryResults)
		db.one.mockResolvedValueOnce(mockBinaryResult)

		return MediaModel.fetchByIdAndDimensions('SOME_UUID').then(binaryData => {
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

	test('parseCustomImageDimensions throws Error on invalid dimensions string', () => {
		let dimensionsString

		// Split into 1 section
		dimensionsString = '100*'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)

		// Split into 2 sections
		dimensionsString = '100x100x100'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})

	test('parseCustomImageDimensions throws Error on invalid width', () => {
		const dimensionsString = 'widthx100'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})

	test('parseCustomImageDimensions throws Error on invalid height', () => {
		const dimensionsString = '100xheight'
		expect(MediaModel.parseCustomImageDimensions.bind(this, dimensionsString)).toThrowError(Error)
	})
})

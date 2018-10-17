/* eslint-disable no-undefined */

jest.mock('../../db')
jest.mock('../../config', () => {
	return {
		media: {
            "maxUploadSize": 100000,
            "originalMediaTag": "original",
            "presetDimensions":{
                "small":{
                    "width": 336,
                    "height": 252
                },
                "medium":{
                    "width": 709,
                    "height": 532
                },
                "large":{
                    "width": 821,
                    "height": 616
                }
            }
		}
	}
})
jest.mock('fs')

import fs from 'fs'
import MediaModel from '../../models/media';

const db = oboRequire('db')

describe('media model', () => {
    const mockUserId = 555;
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
    const mockFileBinaryData = new Buffer("testBinaryInformation");

    beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
        db.one.mockReset();
    })
	afterEach(() => {})

	test('createAndSave inserts media with default dimensions into the database and returns the medias id', () => {
        db.one.mockResolvedValueOnce({id: "NEW_BINARY_ID"});
        db.one.mockResolvedValueOnce({id: "NEW_MEDIA_ID"});

        fs.readFileSync = jest.fn();
        fs.readFileSync.mockReturnValueOnce(mockFileBinaryData);
        
        return MediaModel
                .createAndSave(mockUserId, mockFileInfo)
                .then(mediaId => {
                    expect(db.tx).toBeCalled()
                    
                    // check second arg passed to the first call of transactionDB.one()
                    // the first call adds the media binary information into the binaries db table
                    expect(db.one.mock.calls[0][1])
                        .toEqual({
                            file: mockFileBinaryData, 
                            file_size: mockFileInfo.size,
                            mime_type: mockFileInfo.mimetype
                        })
                    
                    // check second arg passed to the second call of transactionDB.one()
                    // the second call adds media metadata, including user ownership, to media db table
                    expect(db.one.mock.calls[1][1])
                        .toEqual({
                            filename: mockFileInfo.filename, 
                            userId: mockUserId
                        })

                    // check second arg passed to the third call of transactionDB.one()
                    // the third call links the media metadata to the media binary through the media_binaries db table
                    expect(db.one.mock.calls[2][1])
                        .toEqual({
                            dimensions: "original", 
                            mediaBinariesId: "NEW_BINARY_ID",
                            mediaId: "NEW_MEDIA_ID"
                        })
                    
                    // Make sure the temporary media file is removed after the media is stored in the database
                    expect(fs.unlinkSync).toBeCalled();

                    // mediaId is returned to the editor when an image is added, and should be the ID of the user's media 
                    //  in the media db table. The editor retrieves an image based on mediaID
                    expect(mediaId).toEqual("NEW_MEDIA_ID")
                });
    });
    
    test('createAndSave inserts media with specified dimenstions into the database and returns the medias id', () => {
        db.one.mockResolvedValueOnce({id: "NEW_BINARY_ID"});
        db.one.mockResolvedValueOnce({id: "NEW_MEDIA_ID"});

        fs.readFileSync = jest.fn();
        fs.readFileSync.mockReturnValueOnce(mockFileBinaryData);
        
        return MediaModel
                .createAndSave(mockUserId, mockFileInfo, "small")
                .then(mediaId => {
                    expect(db.tx).toBeCalled()
                    
                    // check second arg passed to the first call of transactionDB.one()
                    // the first call adds the media binary information into the binaries db table
                    expect(db.one.mock.calls[0][1])
                        .toEqual({
                            file: mockFileBinaryData, 
                            file_size: mockFileInfo.size,
                            mime_type: mockFileInfo.mimetype
                        })
                    
                    // check second arg passed to the second call of transactionDB.one()
                    // the second call adds media metadata, including user ownership, to media db table
                    expect(db.one.mock.calls[1][1])
                        .toEqual({
                            filename: mockFileInfo.filename, 
                            userId: mockUserId
                        })

                    // check second arg passed to the third call of transactionDB.one()
                    // the third call links the media metadata to the media binary through the media_binaries db table
                    expect(db.one.mock.calls[2][1])
                        .toEqual({
                            dimensions: "small", 
                            mediaBinariesId: "NEW_BINARY_ID",
                            mediaId: "NEW_MEDIA_ID"
                        })

                    // Make sure the temporary media file is removed after the media is stored in the database
                    expect(fs.unlinkSync).toBeCalled();

                    // mediaId is returned to the editor when an image is added, and should be the ID of the user's media 
                    //  in the media db table. The editor retrieves an image based on mediaID
                    expect(mediaId).toEqual("NEW_MEDIA_ID")
                });
	});
});
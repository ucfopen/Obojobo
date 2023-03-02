jest.mock('../server/config')
jest.mock('../server/viewer/viewer_notification_state', () => ({ set: jest.fn() }))
jest.mock('../server/obo_events', () => ({ on: jest.fn(), emit: jest.fn() }))
jest.mock('../server/models/visit')
jest.mock('../server/db')
jest.mock('../server/logger')

/*const mockNotificationEvent = {
	userId: 'mockUserId',
	draftId: 'mockDraftId',
	contentId: 'mockContentId',
	visitId: 'mockVisitId',
	isNotificationEnabled: true,
	payload: {
		open: 'yep'
	}
}*/

//let ve
//let oboEvents
let db
//let logger

describe('viewer notification events', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		jest.resetAllMocks()
		db = oboRequire('server/db')
		//logger = oboRequire('server/logger')

		db.oneOrNone.mockReset()
	})
	afterEach(() => {})
})

test('client:nav:getNotificationStatus', () => {
	/* expect.hasAssertions()

    db.none.mockResolvedValue(null)

    // ve = oboRequire('viewer_events')
    ve = require('../server/viewer/viewer_events')
    const [eventName, callback] = oboEvents.on.mock.calls[1]
    expect(eventName).toBe('client:nav:getNotificationStatus')
    expect(callback).toHaveLength(1)
    return callback(mockNotificationEvent).then(() => {
        expect(db.none).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(db.none).toBeCalledWith(
            expect.stringContaining('SELECT status FROM notification_status'),
            expect.objectContaining({
                //id: mockNotificationEvent.id,
                //isNotificationEnabled: mockNotificationEvent.payload.to
            })
        )
    })*/
})

test('client:nav:getNotificationTitle', () => {
	/*//expect.hasAssertions()

    db.none.mockResolvedValue(null)

     ve = oboRequire('viewer_events')
    ve = require('../server/viewer/viewer_events')
    const [eventName, callback] = oboEvents.on.mock.calls[1]
    expect(eventName).toBe('client:nav:getNotificationTitle')
    expect(callback).toHaveLength(1)
    return callback(mockNotificationEvent).then(() => {
        expect(db.none).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(db.none).toBeCalledWith(
            expect.stringContaining('SELECT title FROM notification_status'),
            expect.objectContaining({
                //id: mockNotificationEvent.id,
                //isNotificationEnabled: mockNotificationEvent.payload.to
            })
        )
    })*/
})

test('client:nav:getNotificationText', () => {
	/*
    expect.hasAssertions()

    db.none.mockResolvedValue(null)

     ve = oboRequire('viewer_events')
    ve = require('../server/viewer/viewer_events')
    const [eventName, callback] = oboEvents.on.mock.calls[1]
    expect(eventName).toBe('client:nav:getNotificationText')
    expect(callback).toHaveLength(1)
    return callback(mockNotificationEvent).then(() => {
        expect(db.none).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledTimes(0)
        expect(db.none).toBeCalledWith(
            expect.stringContaining('SELECT text FROM notification_status'),
            expect.objectContaining({
                //id: mockNotificationEvent.id,
                //isNotificationEnabled: mockNotificationEvent.payload.to
            })
        )
        
    }) */
})

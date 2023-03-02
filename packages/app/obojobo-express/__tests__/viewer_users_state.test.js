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
test('client:nav:getLastLogin', () => {})

// setup express server
const caliper_utils = oboRequire('routes/api/events/caliper_utils')

describe('caliper utils route', () => {
	test('getUrnFromUuid builds expected string', () => {
		expect(caliper_utils.getUrnFromUuid(validUUID())).toEqual(
			'urn:uuid:00000000-0000-0000-0000-000000000000'
		)
	})

	test('getNewGeneratedId builds expected string', () => {
		expect(caliper_utils.getNewGeneratedId()).toEqual(
			'urn:uuid:DEADBEEF-0000-DEAD-BEEF-1234DEADBEEF'
		)
	})

	test('getSessionIds builds expected object', () => {
		const session = {
			id: 3,
			oboLti: {
				launchId: 5
			}
		}
		expect(caliper_utils.getSessionIds(session)).toEqual({
			launchId: 5,
			sessionId: 3
		})
	})

	test('getSessionIds handles no session id', () => {
		const session = {
			oboLti: {
				launchId: 5
			}
		}
		expect(caliper_utils.getSessionIds(session)).toEqual({
			launchId: 5,
			sessionId: undefined
		})
	})

	test('getSessionIds handles no oboLti', () => {
		const session = {
			id: 3
		}
		expect(caliper_utils.getSessionIds(session)).toEqual({
			launchId: undefined,
			sessionId: 3
		})
	})
})

import ValidateCaliper from '../../../../routes/api/events/validate_caliper_event'
import CaliperConstants from '../../../../routes/api/events/caliper_constants'

describe('Validate Caliper Events', () => {
	test('validateArguments checks parameters for required arguments', () => {
		const required = ['type', 'name']
		const params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			actor: { type: 'mockActor' }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).not.toThrowError()
	})

	test('validateArguments throws error if required param is missing', () => {
		const required = ['type', 'name']
		const params = {
			type: 'mockCaliperEvent',
			actor: { type: 'mockActor' }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).toThrowError('Missing required arguments: name')
	})

	test('validateArguments throws error if param is not required or optional', () => {
		const required = ['type', 'name']
		const params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			mockParam: 'Will throw an Error',
			actor: { type: 'mockActor' }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).toThrowError('Invalid arguments: mockParam')
	})

	test('validateArguments throws error if actor does not have type', () => {
		const required = ['type', 'name']
		const params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			actor: {}
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).toThrowError(
			'Invalid actor type. Must provide actor of type mockActor\nMissing required arguments: actor.type'
		)
	})

	test('validateArguments throws error if user actor does not have id', () => {
		const required = ['type', 'name']
		const params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			actor: { type: CaliperConstants.ACTOR_USER }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, CaliperConstants.ACTOR_USER)
		}).toThrowError('Missing required arguments: actor.id')
	})

	test('assignOptions builds additional parameters', () => {
		const object = {
			peppers: ['ghost', 'jalapeno'],
			sessionIds: {
				sessionId: 'mockSessionId',
				launchId: 'mockLaunchId'
			}
		}

		const options = ValidateCaliper.assignOptions(object)

		expect(options).toEqual({
			sessionId: 'mockSessionId',
			launchId: 'mockLaunchId'
		})
	})

	test('assignOptions builds additional parameters with nothing in object', () => {
		const object = {}

		const options = ValidateCaliper.assignOptions(object)

		expect(options).toEqual({})
	})
})

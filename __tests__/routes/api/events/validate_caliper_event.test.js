import ValidateCaliper from '../../../../routes/api/events/validate_caliper_event'
import CaliperConstants from '../../../../routes/api/events/caliper_constants'

describe('Validate Caliper Events', () => {
	test('validateArguments checks parameters for required arguments', () => {
		let required = ['type', 'name']
		let params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			actor: { type: 'mockActor' }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).not.toThrowError()
	})

	test('validateArguments throws error if required param is missing', () => {
		let required = ['type', 'name']
		let params = {
			type: 'mockCaliperEvent',
			actor: { type: 'mockActor' }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, 'mockActor')
		}).toThrowError('Missing required arguments: name')
	})

	test('validateArguments throws error if param is not required or optional', () => {
		let required = ['type', 'name']
		let params = {
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
		let required = ['type', 'name']
		let params = {
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
		let required = ['type', 'name']
		let params = {
			type: 'mockCaliperEvent',
			name: 'A Mock Event',
			actor: { type: CaliperConstants.ACTOR_USER }
		}

		expect(() => {
			ValidateCaliper.validateArguments({ required }, params, CaliperConstants.ACTOR_USER)
		}).toThrowError('Missing required arguments: actor.id')
	})

	test('assignOptions builds additional parameters', () => {
		let object = {
			peppers: ['ghost', 'jalapeno'],
			sessionIds: {
				sessionId: 'mockSessionId',
				launchId: 'mockLaunchId'
			}
		}

		let options = ValidateCaliper.assignOptions(object)

		expect(options).toEqual({
			sessionId: 'mockSessionId',
			launchId: 'mockLaunchId'
		})
	})

	test('assignOptions builds additional parameters with nothing in object', () => {
		let object = {}

		let options = ValidateCaliper.assignOptions(object)

		expect(options).toEqual({})
	})
})

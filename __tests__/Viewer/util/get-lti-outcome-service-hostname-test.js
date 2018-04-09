const Util = require('../../../src/scripts/viewer/util/get-lti-outcome-service-hostname').default

describe('get-lti-outcome-service-hostname', () => {
	test('returns the hostname of the service URL', () => {
		expect(Util('http://this-site.com/return?trick=false')).toBe('this-site.com')
		expect(Util('https://hunter.io#test')).toBe('hunter.io')
	})

	test('returns "the external system" if unable to find a hostname', () => {
		expect(Util('')).toBe('the external system')
		expect(Util()).toBe('the external system')
		expect(Util(undefined)).toBe('the external system')
		expect(Util({})).toBe('the external system')
	})
})

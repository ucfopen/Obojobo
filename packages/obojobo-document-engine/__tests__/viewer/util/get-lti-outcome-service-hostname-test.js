const Util = require('../../../src/scripts/viewer/util/get-lti-outcome-service-hostname').default

describe('get-lti-outcome-service-hostname', () => {
	test('returns the hostname of the service URL', () => {
		expect(Util('http://this-site.com/return?trick=false')).toBe('this-site.com')
		expect(Util('https://hunter.io#test')).toBe('hunter.io')
	})

	test('returns null if url passed in is falsy', () => {
		expect(Util('')).toBe(null)
		expect(Util()).toBe(null)
		expect(Util(null)).toBe(null)
		expect(Util(undefined)).toBe(null)
	})

	test('returns "the external system" if unable to find a hostname', () => {
		expect(Util('website')).toBe('the external system')
		expect(Util({})).toBe('the external system')
	})
})

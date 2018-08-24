const getHostname = require('../../../src/scripts/viewer/util/get-lti-outcome-service-hostname')
	.default

describe('get-lti-outcome-service-hostname', () => {
	test('returns the hostname of the service URL', () => {
		expect(getHostname('http://this-site.com/return?trick=false')).toBe('this-site.com')
		expect(getHostname('https://hunter.io#test')).toBe('hunter.io')
	})

	test('returns null if url passed in is falsy', () => {
		expect(getHostname('')).toBe(null)
		expect(getHostname()).toBe(null)
		expect(getHostname(null)).toBe(null)
		expect(getHostname(undefined)).toBe(null) // eslint-disable-line
	})

	test('returns "the external system" if unable to find a hostname', () => {
		expect(getHostname('website')).toBe('the external system')
		expect(getHostname({})).toBe('the external system')
	})
})

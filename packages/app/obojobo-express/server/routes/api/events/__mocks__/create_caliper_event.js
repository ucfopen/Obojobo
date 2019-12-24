const allEvents = require.requireActual('../create_caliper_event')(null, 'someName')
const mockedCaliperEvents = {}

Object.keys(allEvents).forEach(key => (mockedCaliperEvents[key] = jest.fn()))

module.exports = jest.fn().mockReturnValue(mockedCaliperEvents)

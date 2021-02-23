const logger = {
	debug: jest.fn(),
	error: jest.fn(),
	info: jest.fn(),
	log: jest.fn(),
	trace: jest.fn(),
	warn: jest.fn(),
	logError: jest.fn()
}

module.exports = logger

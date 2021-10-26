global.oboRequire = name => {
	return require(`obojobo-express/${name}`)
}

// make sure all Date objects use a static date
global.mockStaticDate = () => {
	const testDate = new Date('2016-09-22T16:57:14.500Z')
	//eslint-disable-next-line no-global-assign
	Date = class extends Date {
		constructor() {
			super()
			return testDate
		}
	}
	return testDate
}

const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

process.on('unhandledRejection', (reason, p) => {
	// eslint-disable-next-line no-console
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

global.flushPromises = () => {
	return new Promise(resolve => setImmediate(resolve))
}

class XMLSerializer {
	serializeToString() {
		return '<mockSerializedToString/>'
	}
}

global.XMLSerializer = XMLSerializer

// helper to quickly create a standin mock react component with a name
// ex usage: jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
const buildMockReactComponent = name => {
	const MockComponent = () => name
	MockComponent.displayName = name
	return MockComponent
}

global.mockReactComponent = (target, name) => {
	return buildMockReactComponent.call(target, name)
}

// helper to mock functional components using forwardRef
global.mockForwardRefComponent = (target, name) => {
	// some extra magic to deal with mocking a react method that uses forwardRef
	const React = require('react')
	// eslint-disable-next-line react/display-name
	return React.forwardRef((props, ref) => {
		const MockComp = global.mockReactComponent(target, name)
		return <MockComp {...props} theRef={ref}></MockComp>
	})
}

global.window.open = jest.fn()
global.window.katex = {
	renderToString: jest
		.fn()
		.mockImplementation(
			(input, options = {}) =>
				`mock-katex-render-for-${input}-with-options-${JSON.stringify(options)}`
		)
}

// This is used to make sure the test output is clean
// will catch when console output is generated
// this can be when a library like react is complaining but not failing
// check if console was used
let usedConsole = false
;['log', 'error', 'warn'].forEach(key => {
	// eslint-disable-next-line no-console
	const originalFn = console[key]
	// eslint-disable-next-line no-console
	console[key] = (...args) => {
		usedConsole = true
		originalFn(...args)
	}
})

// check if a test failed
// see https://stackoverflow.com/a/62557472/1337972
global.jasmine.getEnv().addReporter({
	specStarted: result => (global.jasmine.currentTest = result)
})

afterEach(() => {
	// if test hasn't failed yet, but console was used, we let it fail
	if (usedConsole && !global.jasmine.currentTest.failedExpectations.length) {
		usedConsole = false
		throw `To keep the unit test output readable you should remove all usages of 'console'. If your test _relies_ on \`console\` you should mock it with 'jest-mock-console'`
	}
})

// @TODO enable this to cause failtures for unhandled rejections
// if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
// 	process.on('unhandledRejection', reason => {
// 		throw reason
// 	})
// 	// Avoid memory leak by adding too many listeners
// 	process.env.LISTENING_TO_UNHANDLED_REJECTION = true
// }

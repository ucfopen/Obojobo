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

const buildMockReactComponent = name => {
	const MockComponent = () => name
	MockComponent.displayName = name
	return MockComponent
}

class XMLSerializer {
	serializeToString() {
		return '<mockSerializedToString/>'
	}
}

global.XMLSerializer = XMLSerializer

// helper to quickly create a standin mock react component with a name
// : jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
global.mockReactComponent = (target, name) => {
	return buildMockReactComponent.call(target, name)
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

const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-16')
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

process.on('unhandledRejection', (reason, p) => {
	// eslint-disable-next-line no-console
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

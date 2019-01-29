const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-15')
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

window.katex = require('katex')


let apiResponseDecorator = require('./api_response_decorator');

let mockArgs = ()=> {
	let res = {}
	let req = {}
	let mockJson = jest.fn().mockImplementation(obj => {
		return true
	})
	let mockStatus = jest.fn().mockImplementation(code => {
		return {json: mockJson}
	})
	let mockNext = jest.fn()
	res.status = mockStatus
	apiResponseDecorator(req, res, mockNext)
	return [res, req, mockJson, mockStatus, mockNext]
}

const functions = ['success', 'missing', 'badInput', 'unexpected', 'reject']
const msgFunctions = ['missing', 'badInput', 'unexpected', 'reject']

describe('api_response_decorator', () => {
	it('sets the expected properties on res', () => {
		expect.assertions(functions.length * 2);
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		functions.forEach(prop => {
			expect(res).toHaveProperty(prop)
			expect(res[prop]).toBeInstanceOf(Function)
		})
	})

	it('calls next', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()
		expect(mockNext).toBeCalledWith()
	})

	it('functions set status codes as expected', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		functions.forEach((prop, index) => { res[prop]() })
		expect(mockStatus.mock.calls).toEqual([[200], [404], [400], [500], [403]])
	})

	it('success to pass the value object', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		const input = {test:true}
		const expected = {status:'ok', value: {test:true}}

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})

	it('messages to be returned in the value object', () =>{
		expect.assertions(msgFunctions.length * 2);

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		msgFunctions.forEach(prop => {
			mockJson.mockReset()
			res[prop]('message text')
			expect(mockJson).toBeCalled()
			expect(mockJson.mock.calls[0][0].value.message).toBe('message text')
		})
	})

	it('messages to set error status in json', () =>{
		expect.assertions(msgFunctions.length);

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		msgFunctions.forEach(prop => {
			mockJson.mockReset()
			res[prop]()
			expect(mockJson.mock.calls[0][0].status).toBe('error')
		})
	})

	it('success Camalizes all result json', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs()

		const input = {top_value:{bottom_value:'leave_me_alone'}}
		const expected = {status:'ok', value: {topValue:{bottomValue:'leave_me_alone'}}}

		res.success(input)
		expect(mockJson).toBeCalledWith(expected)
	})
})

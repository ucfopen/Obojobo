jest.mock('obojobo-chunks-text/util/toggle-hanging-indent')
import toggle from 'obojobo-chunks-text/util/toggle-hanging-indent'

describe('toggleHangingIndet', () => {
	test('inverses hangingIndent on text line nodes', () => {
		// setup
		const editor = {}
		const event = {
			preventDefault: jest.fn()
		}
		const toggleHangingIndent = require('./toggle-hanging-indent').default

		// execute
		toggleHangingIndent(event, editor)

		// verify
		expect(toggle).toHaveBeenCalledWith(editor)
		expect(event.preventDefault).toHaveBeenCalled()
	})
})

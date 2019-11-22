import Common from 'src/scripts/common/index'

import FormatPlugin from 'src/scripts/oboeditor/plugins/format-plugin'

describe('FormatPlugin', () => {
	test('changeToType calls item.switchToType', () => {
		const editor = { value: { document: { getRootBlocksAtRange: () => [
			{ type: 'mock-node' }
		]}}}
		const item = {
			switchType: {
				'mock-type': jest.fn()
			}
		}
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce(item)

		FormatPlugin.commands.changeToType(editor, 'mock-type')

		expect(item.switchType['mock-type']).toHaveBeenCalled()
	})

	test('changeToType does not call item.switchToType when the value doent exist', () => {
		const editor = { value: { document: { getRootBlocksAtRange: () => [
			{ type: 'mock-node' }
		]}}}
		const item = {
			switchType: {
				'mock-type': jest.fn()
			}
		}
		const spy = jest.spyOn(Common.Registry, 'getItemForType')
		spy.mockReturnValueOnce(item)

		FormatPlugin.commands.changeToType(editor, 'mock-other-type')

		expect(item.switchType['mock-type']).not.toHaveBeenCalled()
	})
})

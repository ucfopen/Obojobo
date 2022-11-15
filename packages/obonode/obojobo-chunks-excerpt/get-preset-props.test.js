import getPresetProps from './get-preset-props'

describe('Get Preset Props', () => {
	test('minimal', () => {
		const expected = {
			bodyStyle: 'none',
			width: 'medium',
			font: 'serif',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('minimal')).toEqual(expected)
	})

	test('excerpt', () => {
		const expected = {
			bodyStyle: 'none',
			width: 'medium',
			font: 'palatino',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('excerpt')).toEqual(expected)
	})

	test('simple-filled', () => {
		const expected = {
			bodyStyle: 'filled-box',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('simple-filled')).toEqual(expected)
	})

	test('simple-bordered', () => {
		const expected = {
			bodyStyle: 'bordered-box',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('simple-bordered')).toEqual(expected)
	})

	test('card', () => {
		const expected = {
			bodyStyle: 'card',
			width: 'medium',
			font: 'sans',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('card')).toEqual(expected)
	})

	test('fiction', () => {
		const expected = {
			bodyStyle: 'light-yellow-paper',
			width: 'medium',
			font: 'palatino',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('fiction')).toEqual(expected)
	})

	test('non-fiction', () => {
		const expected = {
			bodyStyle: 'modern-paper',
			width: 'medium',
			font: 'georgia',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('non-fiction')).toEqual(expected)
	})

	test('historical', () => {
		const expected = {
			bodyStyle: 'dark-yellow-paper',
			width: 'medium',
			font: 'palatino',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('historical')).toEqual(expected)
	})

	test('very-historical', () => {
		const expected = {
			bodyStyle: 'aged-paper',
			width: 'medium',
			font: 'palatino',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('very-historical')).toEqual(expected)
	})

	test('white-paper', () => {
		const expected = {
			bodyStyle: 'white-paper',
			width: 'medium',
			font: 'times-new-roman',
			lineHeight: 'moderate',
			fontSize: 'regular',
			topEdge: 'normal',
			bottomEdge: 'fade',
			effect: false
		}

		expect(getPresetProps('white-paper')).toEqual(expected)
	})

	test('instruction-manual', () => {
		const expected = {
			bodyStyle: 'modern-paper',
			width: 'medium',
			font: 'helvetica',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'fade',
			effect: false
		}

		expect(getPresetProps('instruction-manual')).toEqual(expected)
	})

	test('typewritten', () => {
		const expected = {
			bodyStyle: 'white-paper',
			width: 'medium',
			font: 'courier',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'jagged',
			effect: false
		}

		expect(getPresetProps('typewritten')).toEqual(expected)
	})

	test('receipt', () => {
		const expected = {
			bodyStyle: 'white-paper',
			width: 'tiny',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'jagged',
			effect: false
		}

		expect(getPresetProps('receipt')).toEqual(expected)
	})

	test('computer-modern', () => {
		const expected = {
			bodyStyle: 'command-line',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('computer-modern')).toEqual(expected)
	})

	test('computer-hacker-white', () => {
		const expected = {
			bodyStyle: 'term-white',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('computer-hacker-white')).toEqual(expected)
	})

	test('computer-hacker-green', () => {
		const expected = {
			bodyStyle: 'term-green',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('computer-hacker-green')).toEqual(expected)
	})

	test('computer-hacker-orange', () => {
		const expected = {
			bodyStyle: 'term-orange',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('computer-hacker-orange')).toEqual(expected)
	})

	test('modern-text-file', () => {
		const expected = {
			bodyStyle: 'modern-text-file',
			width: 'medium',
			font: 'helvetica',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('modern-text-file')).toEqual(expected)
	})

	test('retro-text-file', () => {
		const expected = {
			bodyStyle: 'retro-text-file',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'generous',
			fontSize: 'smaller',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: true
		}

		expect(getPresetProps('retro-text-file')).toEqual(expected)
	})

	test('computer-c64', () => {
		const expected = {
			bodyStyle: 'term-c64',
			width: 'medium',
			font: 'monospace',
			lineHeight: 'moderate',
			fontSize: 'regular',
			topEdge: 'normal',
			bottomEdge: 'normal',
			effect: false
		}

		expect(getPresetProps('computer-c64')).toEqual(expected)
	})
})

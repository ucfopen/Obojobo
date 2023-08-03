import waitForElement from './wait-for-element'

describe('waitForElement', () => {
	test('waitForElement resolves with the element at the given selector if it exists', async () => {
		const originalDocument = document.querySelector

		const mockEl = jest.fn()

		// Override document.querySelector
		Object.defineProperty(global.document, 'querySelector', {
			value: () => mockEl,
			enumerable: true,
			configurable: true
		})

		const el = await waitForElement('mock-selector')

		expect(el).toBe(mockEl)

		// Restore document.querySelector
		Object.defineProperty(global.document, 'querySelector', { value: originalDocument })
	})

	test('waitForElement uses a MutationObserver if the element does not exist', async () => {
		const originalMutationObserver = global.MutationObserver

		const mockEl = {
			matches: () => {
				return true
			}
		}

		// Override MutationObserver
		const disconnect = jest.fn()
		Object.defineProperty(global, 'MutationObserver', {
			value: callback => {
				return {
					observe: () => {
						callback([
							{
								addedNodes: [mockEl]
							}
						])
					},
					disconnect
				}
			},
			enumerable: true,
			configurable: true
		})

		const el = await waitForElement('mock-selector')

		expect(el).toBe(mockEl)
		expect(disconnect).toHaveBeenCalled()

		// Restore MutationObserver
		Object.defineProperty(global, 'MutationObserver', {
			value: originalMutationObserver
		})
	})

	test('waitForElement does not disconnect if no match found', () => {
		const originalMutationObserver = global.MutationObserver

		const mockEl = {
			matches: () => {
				return false
			}
		}

		// Override MutationObserver
		const disconnect = jest.fn()
		Object.defineProperty(global, 'MutationObserver', {
			value: callback => {
				return {
					observe: () => {
						callback([
							{
								addedNodes: [mockEl]
							}
						])
					},
					disconnect
				}
			},
			enumerable: true,
			configurable: true
		})

		waitForElement('mock-selector')

		expect(disconnect).not.toHaveBeenCalled()

		// Restore MutationObserver
		Object.defineProperty(global, 'MutationObserver', {
			value: originalMutationObserver
		})
	})
})

// Modified from https://paul.kinlan.me/waiting-for-an-element-to-be-created/
const waitForElement = selector => {
	return new Promise(function(resolve, reject) {
		const element = document.querySelector(selector)

		if (element) {
			resolve(element)
			return
		}

		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				const nodes = Array.from(mutation.addedNodes)
				for (const node of nodes) {
					if (node.matches && node.matches(selector)) {
						observer.disconnect()
						resolve(node)
						return
					}
				}
			})
		})

		observer.observe(document.documentElement, { childList: true, subtree: true })
	})
}

export default waitForElement

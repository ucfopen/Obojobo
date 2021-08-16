class MockElement {
	constructor(type, attrs = {}) {
		this.type = type
		this.attrs = attrs
		this.nodeType = 'element'
		this.children = []
		this.parent = null
	}

	addChild(child) {
		this.children.push(child)
		return (child.parent = this)
	}

	addChildAt(child, atIndex) {
		this.children.splice(atIndex, 0, child)
		return (child.parent = this)
	}

	addBefore(childToAdd, targetChild) {
		const index = this.children.indexOf(targetChild)
		return this.addChildAt(childToAdd, index)
	}

	addAfter(childToAdd, targetChild) {
		const index = this.children.indexOf(targetChild)
		return this.addChildAt(childToAdd, index + 1)
	}

	replaceChild(childToReplace, newChild) {
		const index = this.children.indexOf(childToReplace)
		this.children[index] = newChild
		newChild.parent = this
		return (childToReplace.parent = null)
	}

	// Used to determine a list's bullet point or index color (if any)
	getColorOfFirstCharacter() {
		const firstChild = this.children[0]

		if (
			this.type === 'li' &&
			firstChild &&
			firstChild.text &&
			firstChild.text.styleList &&
			firstChild.text.styleList.styles
		) {
			const styles = firstChild.text.styleList.styles
			for (let i = 0; i < styles.length; i++) {
				const style = styles[i]
				if (style && style.type === 'color' && style.start === 0) return style.data.text
			}
		}

		return '#000'
	}
}

Object.defineProperties(MockElement.prototype, {
	firstChild: {
		get() {
			return this.children[0]
		}
	},
	lastChild: {
		get() {
			return this.children[this.children.length - 1]
		}
	}
})

module.exports = MockElement

class MockElement {
	constructor(type, attrs) {
		this.type = type;
		if (attrs == null) { attrs = {}; }
		this.attrs = attrs;
		this.nodeType = 'element';
		this.children = [];
		this.parent = null;
	}

	addChild(child) {
		this.children.push(child);
		return child.parent = this;
	}

	addChildAt(child, atIndex) {
		this.children.splice(atIndex, 0, child);
		return child.parent = this;
	}

	getChildIndex(child) {
		return this.children.indexOf(child);
	}

	addBefore(childToAdd, targetChild) {
		let index = this.getChildIndex(targetChild);
		return this.addChildAt(childToAdd, index);
	}

	addAfter(childToAdd, targetChild) {
		let index = this.getChildIndex(targetChild);
		return this.addChildAt(childToAdd, index + 1);
	}

	replaceChild(childToReplace, newChild) {
		let index = this.getChildIndex(childToReplace);
		this.children[index] = newChild;
		newChild.parent = this;
		return childToReplace.parent = null;
	}
}


Object.defineProperties(MockElement.prototype, {
	"firstChild": { get() { return this.children[0]; }
},
	"lastChild": { get() { return this.children[this.children.length - 1]; }
}
});


export default MockElement;
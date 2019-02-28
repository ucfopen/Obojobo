import StyleableText from '../../common/text/styleable-text'

import Util from './text-group-util'
import TextGroupItem from './text-group-item'

const getItemsArray = function(itemOrItems) {
	if (itemOrItems instanceof TextGroupItem) {
		return [itemOrItems]
	} else {
		return itemOrItems
	}
}

const addChildToGroup = function(itemOrItems, group, atIndex = null) {
	const items = getItemsArray(itemOrItems)

	if (atIndex === null) {
		group.items = group.items.concat(items)
	} else {
		group.items = group.items
			.slice(0, atIndex)
			.concat(items)
			.concat(group.items.slice(atIndex))
	}

	return items.map(item => (item.parent = group))
}

const removeChildFromGroup = function(itemOrItems, group) {
	const removedItems = []
	const items = getItemsArray(itemOrItems)

	for (const item of items) {
		const removed = group.items.splice(item.index, 1)[0]
		removed.parent = null
		removedItems.push(removed)
	}

	return removedItems
}

const setChildToGroup = function(item, group, atIndex) {
	group.items[atIndex] = item
	return (item.parent = group)
}

const removeAllChildrenFromGroup = function(group) {
	for (const item of group.items) {
		item.parent = null
	}

	return (group.items = [])
}

const createChild = (text, data, dataTemplate) =>
	new TextGroupItem(text, Util.createData(data, dataTemplate))

// dataTemplate defines the data object that will be included in each item in the
// textGroup. Attributes in the data added to the group will be ignored if those
// attributes aren't in the dataTemplate (see Util.createData)
class TextGroup {
	constructor(maxItems = Infinity, dataTemplate = {}, initialItems = []) {
		this.maxItems = maxItems
		this.items = []
		this.dataTemplate = Object.freeze(Object.assign({}, dataTemplate))

		for (const item of initialItems) {
			this.add(item.text, item.data)
		}
	}

	clear() {
		return removeAllChildrenFromGroup(this)
	}

	indexOf(item) {
		return this.items.indexOf(item)
	}

	init(numItems = 1) {
		this.clear()

		while (numItems-- && !this.isFull) {
			this.add()
		}

		return this
	}

	fill() {
		if (this.maxItems === Infinity) {
			return
		}

		return (() => {
			const result = []
			while (!this.isFull) {
				result.push(this.add())
			}
			return result
		})()
	}

	add(text, data) {
		if (!this.isFull) addChildToGroup(createChild(text, data, this.dataTemplate), this)
		return this
	}

	addAt(index, text, data) {
		if (!this.isFull) addChildToGroup(createChild(text, data, this.dataTemplate), this, index)
		return this
	}

	addGroup(group, cloneDataFn = Util.defaultCloneFn) {
		return this.addGroupAt(group, null, cloneDataFn)
	}

	addGroupAt(group, index, cloneDataFn = Util.defaultCloneFn) {
		const itemsToAdd = []
		for (const item of group.items) {
			const clone = item.clone(cloneDataFn)
			itemsToAdd.push(createChild(clone.text, clone.data, this.dataTemplate))
		}

		addChildToGroup(itemsToAdd, this, index)

		return this
	}

	get(index) {
		return this.items[index]
	}

	set(index, text, data) {
		return setChildToGroup(createChild(text, data, this.dataTemplate), this, index)
	}

	remove(index) {
		return removeChildFromGroup(this.items[index], this)[0]
	}

	clone(cloneDataFn) {
		const clonedItems = []

		for (const item of this.items) {
			clonedItems.push(item.clone(cloneDataFn))
		}

		return new TextGroup(this.maxItems, this.dataTemplate, clonedItems)
	}

	toDescriptor() {
		const desc = []

		for (const item of this.items) {
			desc.push({ text: item.text.getExportedObject(), data: Util.defaultCloneFn(item.data) })
		}

		return desc
	}

	// textGroup.toSlice(0, 1) will reduce your text group to have one item
	toSlice(from, to = Infinity) {
		removeChildFromGroup(this.items.slice(to), this)
		removeChildFromGroup(this.items.slice(0, from), this)

		return this
	}

	// splits the group into two, one with all the items before the specified index
	// and the other with the items at index and above
	splitBefore(index) {
		const sibling = new TextGroup(this.maxItems, this.dataTemplate)

		while (this.length !== index) {
			const item = this.remove(index)
			sibling.add(item.text, item.data)
		}

		return sibling
	}

	splitText(index, offset) {
		const item = this.items[index]

		const newItem = createChild(
			item.text.split(offset),
			Util.defaultCloneFn(item.data),
			this.dataTemplate
		)

		addChildToGroup(newItem, this, index + 1)

		return newItem
	}

	merge(index, mergeDataFn = Util.defaultMergeFn) {
		const digestedItem = this.items.splice(index + 1, 1)[0]
		const consumerItem = this.items[index]

		if (digestedItem && consumerItem) {
			consumerItem.data = Util.createData(
				mergeDataFn(consumerItem.data, digestedItem.data),
				this.dataTemplate
			)

			consumerItem.text.merge(digestedItem.text)
		}

		return this
	}

	deleteSpan(
		startIndex,
		startTextIndex,
		endIndex,
		endTextIndex,
		merge = true,
		mergeFn = Util.defaultMergeFn
	) {
		const startItem = this.items[startIndex]
		const endItem = this.items[endIndex]
		const startText = startItem.text
		const endText = endItem.text

		if (startText === endText) {
			startText.deleteText(startTextIndex, endTextIndex)
			return
		}

		startText.deleteText(startTextIndex, startText.length)
		endText.deleteText(0, endTextIndex)

		if (merge) {
			const newItems = []
			for (let i = 0; i < this.items.length; i++) {
				const item = this.items[i]
				if (i < startIndex || i > endIndex) {
					newItems.push(item)
				} else if (i === startIndex) {
					newItems.push(startItem)
				} else if (i === endIndex) {
					newItems.push(endItem)
				}
			}

			removeAllChildrenFromGroup(this)
			addChildToGroup(newItems, this)
			return this.merge(startIndex, mergeFn)
		}
	}

	// deletes text but doesn't remove empty texts and doesn't merge any text
	clearSpan(startIndex, startTextIndex, endIndex, endTextIndex) {
		const startItem = this.items[startIndex]
		const endItem = this.items[endIndex]
		const startText = startItem.text
		const endText = endItem.text

		if (startText === endText) {
			startText.deleteText(startTextIndex, endTextIndex)
			return
		}

		startText.deleteText(startTextIndex, startText.length)
		endText.deleteText(0, endTextIndex)

		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i]
			if (i > startIndex && i < endIndex) {
				item.text.init()
			}
		}

		return this
	}

	styleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction(
			'styleText',
			startIndex,
			startTextIndex,
			endIndex,
			endTextIndex,
			styleType,
			styleData
		)
	}

	unstyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction(
			'unstyleText',
			startIndex,
			startTextIndex,
			endIndex,
			endTextIndex,
			styleType,
			styleData
		)
	}

	toggleStyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction(
			'toggleStyleText',
			startIndex,
			startTextIndex,
			endIndex,
			endTextIndex,
			styleType,
			styleData
		)
	}

	applyStyleFunction(fn, startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		const startItem = this.items[startIndex]
		const endItem = this.items[endIndex]
		const startText = startItem.text
		const endText = endItem.text

		if (startText === endText) {
			startText[fn](styleType, startTextIndex, endTextIndex, styleData)
			return
		}

		let foundStartText = false
		for (const item of this.items) {
			if (item.text === startText) {
				item.text[fn](styleType, startTextIndex, startText.length, styleData)
				foundStartText = true
			} else if (item.text === endText) {
				item.text[fn](styleType, 0, endTextIndex, styleData)
				break
			} else if (foundStartText) {
				item.text[fn](styleType, 0, item.text.length, styleData)
			}
		}

		return this
	}

	getStyles(startIndex, startTextIndex, endIndex, endTextIndex) {
		let style
		const startItem = this.items[startIndex]
		const endItem = this.items[endIndex]

		if (
			startItem === null ||
			endItem === null ||
			typeof startItem === 'undefined' ||
			typeof endItem === 'undefined'
		) {
			return {}
		}

		const startText = startItem.text
		const endText = endItem.text

		if (
			startText === null ||
			endText === null ||
			typeof startText === 'undefined' ||
			typeof endText === 'undefined'
		) {
			return {}
		}

		if (startText === endText) {
			return startText.getStyles(startTextIndex, endTextIndex)
		}

		let numTexts = 0
		const allStyles = {}
		let foundStartText = false
		for (const item of this.items) {
			let styles = {}

			if (item.text === startText) {
				numTexts++
				styles = item.text.getStyles(startTextIndex, startText.length)
				foundStartText = true
			} else if (item.text === endText) {
				numTexts++
				styles = item.text.getStyles(0, endTextIndex)
			} else if (foundStartText) {
				numTexts++
				styles = item.text.getStyles(0, item.text.length)
			}

			for (style in styles) {
				if (typeof allStyles[style] !== 'undefined') {
					allStyles[style]++
				} else {
					allStyles[style] = 1
				}
			}

			if (item.text === endText) {
				break
			}
		}

		const returnedStyles = {}
		for (style in allStyles) {
			if (allStyles[style] === numTexts) {
				returnedStyles[style] = style
			}
		}

		return returnedStyles
	}
}

Object.defineProperties(TextGroup.prototype, {
	length: {
		get() {
			return this.items.length
		}
	},

	first: {
		get() {
			return this.items[0]
		}
	},

	last: {
		get() {
			return this.items[this.items.length - 1]
		}
	},

	isFull: {
		get() {
			return this.items.length === this.maxItems
		}
	},

	isEmpty: {
		get() {
			return this.items.length === 0
		}
	},

	isBlank: {
		get() {
			return this.isEmpty || (this.items.length === 1 && this.first.text.length === 0)
		}
	}
})

TextGroup.fromDescriptor = function(
	descriptor,
	maxItems,
	dataTemplate,
	restoreDataDescriptorFn = Util.defaultCloneFn
) {
	const items = []
	for (const item of descriptor) {
		items.push(
			createChild(
				StyleableText.createFromObject(item.text),
				restoreDataDescriptorFn(item.data),
				dataTemplate
			)
		)
	}

	return new TextGroup(maxItems, dataTemplate, items)
}

TextGroup.create = function(maxItems = Infinity, dataTemplate = {}, numItemsToCreate = 1) {
	const group = new TextGroup(maxItems, dataTemplate)
	group.init(numItemsToCreate)

	return group
}

export default TextGroup

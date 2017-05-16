import StyleableText from 'ObojoboDraft/Common/text/styleable-text';

import Util from './text-group-util';
import TextGroupItem from './text-group-item';

import ObjectAssign from 'object-assign';


let getItemsArray = function(itemOrItems) {
	if (itemOrItems instanceof TextGroupItem) {
		return [itemOrItems];
	} else {
		return itemOrItems;
	}
};

let addChildToGroup = function(itemOrItems, group, atIndex) {
	if (atIndex == null) { atIndex = null; }
	let items = getItemsArray(itemOrItems);

	if (atIndex === null) {
		group.items = group.items.concat(items);
	} else {
		group.items = group.items.slice(0, atIndex).concat(items).concat(group.items.slice(atIndex));
	}

	return Array.from(items).map((item) =>
		(item.parent = group));
};

let removeChildFromGroup = function(itemOrItems, group) {
	let removedItems = [];
	let items = getItemsArray(itemOrItems);

	for (let item of Array.from(items)) {
		let removed = group.items.splice(item.index, 1)[0];
		removed.parent = null;
		removedItems.push(removed);
	}

	return removedItems;
};

let setChildToGroup = function(item, group, atIndex) {
	group.items[atIndex] = item;
	return item.parent = group;
};

let removeAllChildrenFromGroup = function(group) {
	for (let item of Array.from(group.items)) {
		item.parent = null;
	}

	return group.items = [];
};

let createChild = (text, data, dataTemplate) => new TextGroupItem(text, Util.createData(data, dataTemplate));


// dataTemplate defines the data object that will be included in each item in the
// textGroup. Attributes in the data added to the group will be ignored if those
// attributes aren't in the dataTemplate (see Util.createData)
class TextGroup {
	constructor(maxItems, dataTemplate, initialItems) {
		if (maxItems == null) { maxItems = Infinity; }
		this.maxItems = maxItems;
		if (dataTemplate == null) { dataTemplate = {}; }
		if (initialItems == null) { initialItems = []; }
		this.items = [];
		this.dataTemplate = Object.freeze(ObjectAssign({}, dataTemplate));

		for (let item of Array.from(initialItems)) {
			this.add(item.text, item.data);
		}
	}

	clear() {
		return removeAllChildrenFromGroup(this);
	}

	indexOf(item) {
		return this.items.indexOf(item);
	}

	init(numItems) {
		if (numItems == null) { numItems = 1; }
		this.clear();

		while (numItems-- && !this.isFull) {
			this.add();
		}

		return this;
	}

	fill() {
		if (this.maxItems === Infinity) { return; }

		return (() => {
			let result = [];
			while (!this.isFull) {
				result.push(this.add());
			}
			return result;
		})();
	}

	add(text, data) {
		if (this.isFull) { return this; }

		addChildToGroup(createChild(text, data, this.dataTemplate), this);

		return this;
	}

	addAt(index, text, data) {
		if (this.isFull) { return this; }

		addChildToGroup(createChild(text, data, this.dataTemplate), this, index);

		return this;
	}

	addGroup(group, cloneDataFn) {
		if (cloneDataFn == null) { cloneDataFn = Util.defaultCloneFn; }
		return this.addGroupAt(group, null, cloneDataFn);
	}

	addGroupAt(group, index, cloneDataFn) {
		if (cloneDataFn == null) { cloneDataFn = Util.defaultCloneFn; }
		let itemsToAdd = [];
		for (let item of Array.from(group.items)) {
			let clone = item.clone(cloneDataFn);
			itemsToAdd.push(createChild(clone.text, clone.data, this.dataTemplate));
		}

		addChildToGroup(itemsToAdd, this, index);

		return this;
	}

	get(index) {
		return this.items[index];
	}

	set(index, text, data) {
		return setChildToGroup(createChild(text, data, this.dataTemplate), this, index);
	}

	remove(index) {
		return removeChildFromGroup(this.items[index], this)[0];
	}

	clone(cloneDataFn) {
		if (cloneDataFn == null) { cloneDataFn = Util.defaultCloneFn; }
		let clonedItems = [];

		for (let item of Array.from(this.items)) {
			clonedItems.push(item.clone(cloneDataFn));
		}

		return new TextGroup(this.maxItems, this.dataTemplate, clonedItems);
	}

	toDescriptor() {
		let desc = [];

		for (let item of Array.from(this.items)) {
			desc.push({ text:item.text.getExportedObject(), data:Util.defaultCloneFn(item.data) });
		}

		return desc;
	}

	// textGroup.toSlice(0, 1) will reduce your text group to have one item
	toSlice(from, to) {
		if (to == null) { to = Infinity; }
		removeChildFromGroup(this.items.slice(to), this);
		removeChildFromGroup(this.items.slice(0, from), this);

		return this;
	}

	// splits the group into two, one with all the items before the specified index
	// and the other with the items at index and above
	splitBefore(index) {
		let sibling = new TextGroup(this.maxItems, this.dataTemplate);

		while (this.length !== index) {
			let item = this.remove(index);
			sibling.add(item.text, item.data);
		}

		return sibling;
	}

	splitText(index, offset) {
		let item = this.items[index];

		let newItem = createChild(item.text.split(offset), Util.defaultCloneFn(item.data), this.dataTemplate);

		addChildToGroup(newItem, this, index + 1);

		return newItem;
	}

	merge(index, mergeDataFn) {
		if (mergeDataFn == null) { mergeDataFn = Util.defaultMergeFn; }
		let digestedItem = this.items.splice(index + 1, 1)[0];
		let consumerItem = this.items[index];

		if (!digestedItem || !consumerItem) { return this; }

		consumerItem.data = Util.createData(mergeDataFn(consumerItem.data, digestedItem.data), this.dataTemplate);

		consumerItem.text.merge(digestedItem.text);
		return this;
	}

	deleteSpan(startIndex, startTextIndex, endIndex, endTextIndex, merge, mergeFn) {
		if (merge == null) { merge = true; }
		if (mergeFn == null) { mergeFn = Util.defaultMergeFn; }
		let startItem = this.items[startIndex];
		let endItem   = this.items[endIndex];

		if (!startItem) { startItem = this.first; }
		if (!endItem) {   endItem   = this.last; }

		let startText = startItem.text;
		let endText   = endItem.text;

		if (startText === endText) {
			startText.deleteText(startTextIndex, endTextIndex);
			return;
		}

		startText.deleteText(startTextIndex, startText.length);
		endText.deleteText(0, endTextIndex);

		if (merge) {
			let newItems = [];
			for (let i = 0; i < this.items.length; i++) {
				let item = this.items[i];
				if ((i < startIndex) || (i > endIndex)) {
					newItems.push(item);
				} else if (i === startIndex) {
					newItems.push(startItem);
				} else if (i === endIndex) {
					newItems.push(endItem);
				}
			}

			removeAllChildrenFromGroup(this);
			addChildToGroup(newItems, this);
			return this.merge(startIndex, mergeFn);
		}
	}

	// deletes text but doesn't remove empty texts and doesn't merge any text
	clearSpan(startIndex, startTextIndex, endIndex, endTextIndex) {
		let startItem = this.items[startIndex];
		let endItem   = this.items[endIndex];
		let startText = startItem.text;
		let endText   = endItem.text;

		if (startText === endText) {
			startText.deleteText(startTextIndex, endTextIndex);
			return;
		}

		startText.deleteText(startTextIndex, startText.length);
		endText.deleteText(0, endTextIndex);

		for (let i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if ((i > startIndex) && (i < endIndex)) {
				item.text.init();
			}
		}

		return this;
	}

	styleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction('styleText', arguments);
	}

	unstyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction('unstyleText', arguments);
	}

	//@TODO - This won't work correctly
	toggleStyleText(startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData) {
		return this.applyStyleFunction('toggleStyleText', arguments);
	}

	applyStyleFunction(fn, args) {
		let [startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData] = Array.from(args);

		// console.log 'APPLY STYLE FUNCTION', startIndex, startTextIndex, endIndex, endTextIndex, styleType, styleData

		let startItem = this.items[startIndex];
		let endItem   = this.items[endIndex];
		let startText = startItem.text;
		let endText   = endItem.text;

		if (startText === endText) {
			startText[fn](styleType, startTextIndex, endTextIndex, styleData);
			return;
		}


		let foundStartText = false;
		for (let item of Array.from(this.items)) {
			if (item.text === startText) {
				item.text[fn](styleType, startTextIndex, startText.length, styleData);
				foundStartText = true;
			} else if (item.text === endText) {
				item.text[fn](styleType, 0, endTextIndex, styleData);
				break;
			} else if (foundStartText) {
				item.text[fn](styleType, 0, item.text.length, styleData);
			}
		}

		return this;
	}

	getStyles(startIndex, startTextIndex, endIndex, endTextIndex) {
		let style;
		let startItem = this.items[startIndex];
		let endItem   = this.items[endIndex];

		if ((startItem == null) || (endItem == null)) { return {}; }

		let startText = startItem.text;
		let endText   = endItem.text;

		if ((startText == null) || (endText == null)) { return {}; }

		if (startText === endText) {
			return startText.getStyles(startTextIndex, endTextIndex);
		}

		let numTexts = 0;
		let allStyles = {};
		let foundStartText = false;
		for (let item of Array.from(this.items)) {
			let styles = {};

			if (item.text === startText) {
				numTexts++;
				styles = item.text.getStyles(startTextIndex, startText.length);
				foundStartText = true;
			} else if (item.text === endText) {
				numTexts++;
				styles = item.text.getStyles(0, endTextIndex);
			} else if (foundStartText) {
				numTexts++;
				styles = item.text.getStyles(0, item.text.length);
			}

			for (style in styles) {
				if (allStyles[style] != null) {
					allStyles[style]++;
				} else {
					allStyles[style] = 1;
				}
			}

			if (item.text === endText) { break; }
		}

		let returnedStyles = {};
		for (style in allStyles) {
			if (allStyles[style] === numTexts) {
				returnedStyles[style] = style;
			}
		}

		return returnedStyles;
	}


	__debug_print() {
		console.log('========================');
		return Array.from(this.items).map((item) =>
			(item.text.__debug_print(),
			console.log(JSON.stringify(item.data)),
			console.log('---------------------')));
	}
}


Object.defineProperties(TextGroup.prototype, {
	"length": {
		"get"() { return this.items.length; }
	},

	"first": {
		"get"() { return this.items[0]; }
	},

	"last": {
		"get"() { return this.items[this.items.length - 1]; }
	},

	"isFull": {
		"get"() { return this.items.length === this.maxItems; }
	},

	"isEmpty": {
		"get"() { return this.items.length === 0; }
	},

	"isBlank": {
		"get"() { return this.isEmpty || ((this.items.length === 1) && (this.first.text.length === 0)); }
	}
});

TextGroup.fromDescriptor = function(descriptor, maxItems, dataTemplate, restoreDataDescriptorFn) {
	if (restoreDataDescriptorFn == null) { restoreDataDescriptorFn = Util.defaultCloneFn; }
	let items = [];
	for (let item of Array.from(descriptor)) {
		items.push(createChild(StyleableText.createFromObject(item.text), restoreDataDescriptorFn(item.data), dataTemplate));
	}

	return new TextGroup(maxItems, dataTemplate, items);
};

TextGroup.create = function(maxItems, dataTemplate, numItemsToCreate) {
	if (maxItems == null) { maxItems = Infinity; }
	if (dataTemplate == null) { dataTemplate = {}; }
	if (numItemsToCreate == null) { numItemsToCreate = 1; }
	let group = new TextGroup(maxItems, dataTemplate);
	group.init(numItemsToCreate);

	return group;
};





//@TODO
window.TextGroup = TextGroup;


export default TextGroup;
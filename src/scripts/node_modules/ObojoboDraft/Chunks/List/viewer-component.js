//@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!

import './viewer-component.scss';

import ListStyles from './list-styles';

import ObojoboDraft from 'ObojoboDraft';

let { TextGroup } = ObojoboDraft.textGroup;
let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { Chunk } = ObojoboDraft.models;
let { MockElement } = ObojoboDraft.mockDOM;
let { MockTextNode } = ObojoboDraft.mockDOM;
let { TextChunk } = ObojoboDraft.chunk;
let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler;
let { OboComponent } = ObojoboDraft.components;

let selectionHandler = new SelectionHandler();

var List = React.createClass({
	createMockListElement(data, indentLevel) {
		let style = data.listStyles.get(indentLevel);

		let tag = style.type === 'unordered' ? 'ul' : 'ol';
		let el = new MockElement(tag);
		el.start = style.start;
		el._listStyleType = style.bulletStyle;

		return el;
	},

	addItemToList(ul, li, lis) {
		ul.addChild(li);
		li.listStyleType = ul._listStyleType;
		return lis.push(li);
	},

	render() {
		let curUl;
		window.yeOldListHandler = List.commandHandler;
		window.yeOldListChunk = this.props.model;

		let data = this.props.model.modelState;

		let texts = data.textGroup;

		let curIndentLevel = 0;
		let curIndex = 0;
		let rootUl = (curUl = this.createMockListElement(data, curIndentLevel));
		let lis = [];

		let li = new MockElement('li');
		this.addItemToList(curUl, li, lis);

		for (let itemIndex = 0; itemIndex < texts.items.length; itemIndex++) {
			// if this item is lower than the current indent level...
			let item = texts.items[itemIndex];
			if (item.data.indent < curIndentLevel) {
				// traverse up the tree looking for our curUl:
				while (curIndentLevel > item.data.indent) {
					curUl = curUl.parent.parent;
					curIndentLevel--;
				}

			// else, if this item is higher than the current indent level...
			} else if (item.data.indent > curIndentLevel) {
				// traverse down the tree...
				while (curIndentLevel < item.data.indent) {
					curIndentLevel++;

					// if the last LI's last child isn't a UL, create it
					if (((curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !== 'ul') && ((curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !== 'ol')) {
						let newUl = this.createMockListElement(data, curIndentLevel);
						let newLi = new MockElement('li');
						this.addItemToList(newUl, newLi, lis);
						curUl.lastChild.addChild(newUl);
						curUl = newUl;
					} else {
						curUl = curUl.lastChild.lastChild;
					}
				}
			}

			// if the lastChild is not an LI or it is an LI that already has text inside
			if (!((curUl.lastChild != null ? curUl.lastChild.type : undefined) === 'li') || ((curUl.lastChild != null ? curUl.lastChild.lastChild : undefined) != null)) {
				li = new MockElement('li');
				this.addItemToList(curUl, li, lis);
			}

			let text = new MockTextNode(item.text);
			text.index = curIndex;
			curIndex++;

			curUl.lastChild.addChild(text);
		}


		// console.log 'TREE'
		// console.log '==========================================='
		// @printTree '', rootUl, curUl

		// Remove bullets from nested LIs
		for (li of Array.from(lis)) {
			if (__guard__(li.children != null ? li.children[0] : undefined, x => x.nodeType) !== 'text') {
				li.listStyleType = 'none';
			}
		}

		// React.createElement 'div', { style: { marginLeft: (data.indent * 20) + 'px' } }, @renderEl(rootUl, 0, 0)
		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--list pad">
				<div data-indent={data.indent}>
					{this.renderEl(rootUl, 0, 0)}
				</div>
			</TextChunk>
		</OboComponent>;
	},

	renderEl(node, index, indent) {
		let key = this.props.model.cid + '-' + indent + '-' + index;

		switch (node.nodeType) {
			case 'text':    return <TextGroupEl parentModel={this.props.model} textItem={{text:node.text, data:{}}} key={key} groupIndex={node.index} />;
			case 'element': return React.createElement(node.type, { key, start:node.start, style: { listStyleType:node.listStyleType } }, this.renderChildren(node.children, indent + 1));
		}
	},

	renderChildren(children, indent) {
		// console.log 'renderChildren', children
		let els = [];
		for (let index = 0; index < children.length; index++) {
			let child = children[index];
			els.push(this.renderEl(child, index, indent));
		}

		return els;
	}
});


export default List;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
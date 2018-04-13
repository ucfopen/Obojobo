//@TODO - HAS TO REBUILD MOCKELEMENT STRUCTURE EVERYTIME, WOULD LIKE TO NOT HAVE TO DO THAT!

import './viewer-component.scss'

import ListStyles from './list-styles'

import Common from 'Common'

let { TextGroup } = Common.textGroup
let { TextGroupEl } = Common.chunk.textChunk
let { Chunk } = Common.models
let { MockElement } = Common.mockDOM
let { MockTextNode } = Common.mockDOM
let { TextChunk } = Common.chunk
let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler
let { OboComponent } = Common.components

let selectionHandler = new SelectionHandler()

const createMockListElement = (data, indentLevel) => {
	let style = data.listStyles.get(indentLevel)

	let tag = style.type === 'unordered' ? 'ul' : 'ol'
	let el = new MockElement(tag)
	el.start = style.start
	el._listStyleType = style.bulletStyle

	return el
}

const addItemToList = (ul, li, lis) => {
	ul.addChild(li)
	li.listStyleType = ul._listStyleType
	return lis.push(li)
}

const renderEl = (props, node, index, indent) => {
	let key = `${props.model.cid}-${indent}-${index}`

	switch (node.nodeType) {
		case 'text':
			return (
				<TextGroupEl
					parentModel={props.model}
					textItem={{ text: node.text, data: {} }}
					key={key}
					groupIndex={node.index}
				/>
			)
		case 'element':
			let ElType = node.type
			return (
				<ElType key={key} start={node.start} style={{ listStyleType: node.listStyleType }}>
					{renderChildren(props, node.children, indent + 1)}
				</ElType>
			)
	}
}

const renderChildren = (props, children, indent) => {
	let els = []
	for (let index = 0; index < children.length; index++) {
		let child = children[index]
		els.push(renderEl(props, child, index, indent))
	}

	return els
}

const __guard__ = (value, transform) => {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}

export default props => {
	let curUl

	let data = props.model.modelState

	let texts = data.textGroup

	let curIndentLevel = 0
	let curIndex = 0
	let rootUl = (curUl = createMockListElement(data, curIndentLevel))
	let lis = []

	let li = new MockElement('li')
	addItemToList(curUl, li, lis)

	for (let itemIndex = 0; itemIndex < texts.items.length; itemIndex++) {
		// if this item is lower than the current indent level...
		let item = texts.items[itemIndex]
		if (item.data.indent < curIndentLevel) {
			// traverse up the tree looking for our curUl:
			while (curIndentLevel > item.data.indent) {
				curUl = curUl.parent.parent
				curIndentLevel--
			}

			// else, if this item is higher than the current indent level...
		} else if (item.data.indent > curIndentLevel) {
			// traverse down the tree...
			while (curIndentLevel < item.data.indent) {
				curIndentLevel++

				// if the last LI's last child isn't a UL, create it
				if (
					(curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !==
						'ul' &&
					(curUl.lastChild.lastChild != null ? curUl.lastChild.lastChild.type : undefined) !== 'ol'
				) {
					let newUl = createMockListElement(data, curIndentLevel)
					let newLi = new MockElement('li')
					addItemToList(newUl, newLi, lis)
					curUl.lastChild.addChild(newUl)
					curUl = newUl
				} else {
					curUl = curUl.lastChild.lastChild
				}
			}
		}

		// if the lastChild is not an LI or it is an LI that already has text inside
		if (
			!((curUl.lastChild != null ? curUl.lastChild.type : undefined) === 'li') ||
			(curUl.lastChild != null ? curUl.lastChild.lastChild : undefined) != null
		) {
			li = new MockElement('li')
			addItemToList(curUl, li, lis)
		}

		let text = new MockTextNode(item.text)
		text.index = curIndex
		curIndex++

		curUl.lastChild.addChild(text)
	}

	// Remove bullets from nested LIs
	for (li of Array.from(lis)) {
		if (__guard__(li.children != null ? li.children[0] : undefined, x => x.nodeType) !== 'text') {
			li.listStyleType = 'none'
		}
	}

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--list pad">
				<div data-indent={data.indent}>{renderEl(props, rootUl, 0, 0)}</div>
			</TextChunk>
		</OboComponent>
	)
}

import './viewer-component.scss'
import './editor-component.scss'

import React from 'react'
import { Transforms, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import Component from 'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

const { Button } = Common.components

class Table extends React.Component {
	constructor(props) {
		super(props)

		this.returnFocusOnTab = this.returnFocusOnTab.bind(this)
		this.toggleHeader = this.toggleHeader.bind(this)
		this.toggleFixedWidthCell = this.toggleFixedWidthCell.bind(this)
	}

	toggleHeader() {
		const editor = this.props.editor

		const topRow = this.props.element.children[0]
		const content = topRow.content
		const header = !content.header

		// Change the header flag on the table
		const tablePath = ReactEditor.findPath(editor, this.props.element)
		Transforms.setNodes(
			editor,
			{ content: { ...this.props.element.content, header } },
			{ at: tablePath }
		)

		// Change the header flag on the top row
		const path = ReactEditor.findPath(editor, topRow)
		Transforms.setNodes(editor, { content: { ...topRow.content, header } }, { at: path })

		// Change the header flag on each cell of the top row
		// This is what actually alters the display
		for (const [child, childPath] of Node.children(editor, path)) {
			Transforms.setNodes(editor, { content: { ...child.content, header } }, { at: childPath })
		}
	}

	toggleFixedWidthCell() {
		const editor = this.props.editor

		const fixedWidth = !this.props.element.fixedWidth

		// Toggling the fixed width cell property.
		const tablePath = ReactEditor.findPath(editor, this.props.element)
		Transforms.setNodes(
			editor,
			{ content: { ...this.props.element.content, fixedWidth } },
			{ at: tablePath }
		)
	}

	// Only return on tab - the table cell menu returns on shift+tab
	returnFocusOnTab(event) {
		if (event.key === 'Tab' && !event.shiftKey) {
			event.preventDefault()
			return ReactEditor.focus(this.props.editor)
		}
	}

	renderButton() {
		return (
			<div className="buttonbox-box" contentEditable={false}>
				<div className="box-border">
					<Button
						className="toggle-header"
						onClick={this.toggleHeader}
						onKeyDown={this.returnFocusOnTab}
					>
						Toggle Header
					</Button>
					<Button
						className="toggle-fixed-width"
						onClick={this.toggleFixedWidthCell}
						onKeyDown={this.returnFocusOnTab}
					>
						Toggle Fixed Width Cells
					</Button>
				</div>
			</div>
		)
	}

	render() {

		const { fixedWidth } = this.props.element

		return (
			<Component {...this.props}>
				<div className={'obojobo-draft--chunks--table viewer pad'}>
					<div className={'container'}>
						<table className={fixedWidth ? 'view' : 'view no-fixed-width'} key="table">
							<tbody>{this.props.children}</tbody>
						</table>
					</div>
					{this.props.selected ? this.renderButton() : null}
				</div>
			</Component>
		)
	}
}

export default withSlateWrapper(Table)

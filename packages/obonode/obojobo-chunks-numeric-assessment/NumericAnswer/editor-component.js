import './editor-component.scss'

import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import NumericOption from './numeric-option'
import { fullTextToSimplifed, EXACT_ANSWER, MARGIN_OF_ERROR, WITHIN_A_RANGE } from '../constants'
import debounce from 'obojobo-document-engine/src/scripts/common/util/debounce'
import DOMUtil from 'obojobo-document-engine/src/scripts/common/page/dom-util'

class NumericAnswer extends React.Component {
	constructor(props) {
		super(props)

		// This debounce is necessary to get slate to update the node data.
		// I've tried several ways to remove it but haven't been able to
		// get it work :(
		// If you have a solution please have at it!
		this.updateNodeFromState = debounce(1, this.updateNodeFromState)

		// copy the attributes we want into state
		const content = this.props.element.content
		this.state = { ...content }

		this.freezeEditor = this.freezeEditor.bind(this)
		this.unfreezeEditor = this.unfreezeEditor.bind(this)

		this.onHandleInputChange = this.onHandleInputChange.bind(this)
		this.onClickDropdown = this.onClickDropdown.bind(this)
	}

	updateNodeFromState() {
		const content = this.props.element.content
		const path = ReactEditor.findPath(this.props.editor, this.props.element)

		Transforms.setNodes(this.props.editor, { content: { ...content, ...this.state } }, { at: path })
	}

	freezeEditor() {
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor(event) {
		event.preventDefault()
		event.stopPropagation()

		this.props.editor.toggleEditable(true)
	}

	onHandleInputChange(event) {
		event.preventDefault()
		event.stopPropagation()

		const { name, value } = event.target

		this.setState({
			...this.state,
			[name]: value
		})
	}

	getAnswerFromState(state) {
		if (typeof this.state.answer !== 'undefined') {
			return this.state.answer
		}

		if (typeof this.state.start !== 'undefined') {
			return this.state.start
		}

		return '1'
	}

	getStateForRequirement(requirement) {
		switch (requirement) {
			case MARGIN_OF_ERROR:
				return {
					requirement: fullTextToSimplifed[requirement],
					type: 'percent',
					margin: '0',
					answer: this.getAnswerFromState(this.state),
					start: undefined, //eslint-disable-line no-undefined
					end: undefined //eslint-disable-line no-undefined
				}

			case EXACT_ANSWER:
				return {
					requirement: fullTextToSimplifed[requirement],
					answer: this.getAnswerFromState(this.state),
					type: undefined, //eslint-disable-line no-undefined
					start: undefined, //eslint-disable-line no-undefined
					end: undefined, //eslint-disable-line no-undefined
					margin: undefined //eslint-disable-line no-undefined
				}

			case WITHIN_A_RANGE:
				return {
					requirement: fullTextToSimplifed[requirement],
					start: this.getAnswerFromState(this.state),
					end: this.getAnswerFromState(this.state),
					answer: undefined, //eslint-disable-line no-undefined
					type: undefined, //eslint-disable-line no-undefined
					margin: undefined //eslint-disable-line no-undefined
				}
		}
	}

	onClickDropdown(event) {
		event.preventDefault()
		event.stopPropagation()

		const { name, value } = event.target

		switch (name) {
			case 'requirement':
				this.setState(this.getStateForRequirement(value))
				break

			case 'margin-type':
				this.setState({
					type: fullTextToSimplifed[value]
				})
				break
		}
	}

	render() {
		return (
			<div className="numeric-input-container" contentEditable={false}>
				<NumericOption
					freezeEditor={this.freezeEditor}
					unfreezeEditor={this.unfreezeEditor}
					numericChoice={this.state}
					onHandleInputChange={this.onHandleInputChange}
					onClickDropdown={this.onClickDropdown}
				/>
				{this.props.children}
			</div>
		)
	}
}

export default withSlateWrapper(NumericAnswer)

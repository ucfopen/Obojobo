/* eslint-disable */

import OboModel from './obomodel'

class Chunk extends OboModel {
	static initClass() {
		this.prototype.urlRoot = '/api/chunk'
	}
	sync(method, model, options) {
		model.dirty = false
		model.needsUpdate = false

		if (method === 'update' || method === 'create') {
			options.data = JSON.stringify({ chunk: model.toJSON() })
			options.contentType = 'application/json'
		}

		return Backbone.sync(method, model, options)
	}

	url() {
		if (this.new != null) {
			return this.urlRoot
		}
		return this.urlRoot + '/' + encodeURIComponent(this.get('id'))
	}

	save(attrs, options) {
		if (this.new != null) {
			this.assignNewId()
			options.type = 'post'
			options.success = () => {
				if (this.new) {
					delete this.new
				}
				return true
			}

			console.log(options)
		}

		return super.save(attrs, options)
	}

	onChange(model, options) {
		if (model.get('index') !== model.previous('index')) {
			this.dirty = true
			return (this.needsUpdate = true)
		}
	}

	defaults() {
		return {
			type: 'none',
			content: null,
			contentType: 'json',
			derivedFrom: null,
			index: null,
			draftId: null
		}
	}

	callCommandFn(fn, content) {
		const componentClass = this.getComponent()
		let selection = null
		if ((this.page != null ? this.page.module : undefined) != null) {
			;({ selection } = this.page.module.app.state)
		}
		if (componentClass.getCommandHandler == null) {
			return null
		}
		const commandHandler = componentClass.getCommandHandler(this, selection)
		if (!(commandHandler != null ? commandHandler[fn] : undefined)) {
			return null
		}
		return commandHandler[fn].apply(commandHandler, [selection, this].concat(content))
	}

	callSelectionFn(fn, content) {
		const componentClass = this.getComponent()
		let selection = null
		if ((this.page != null ? this.page.module : undefined) != null) {
			;({ selection } = this.page.module.app.state)
		}
		const selectionHandler = this.selectionHandler(this, selection)
		if (!(selectionHandler != null ? selectionHandler[fn] : undefined)) {
			return null
		}
		return selectionHandler[fn].apply(selectionHandler, [selection, this].concat(content))
	}

	isEditing() {
		return this.page.module.app.state.editingChunk === this
	}

	getCaretEdge() {
		return this.callCommandFn('getCaretEdge')
	}
	isEmpty() {
		return this.callCommandFn('isEmpty')
	}
	canRemoveSibling(sibling) {
		return this.callCommandFn('canRemoveSibling', [sibling])
	}
	insertText(textToInsert, stylesToApply, stylesToRemove) {
		return this.callCommandFn('insertText', [textToInsert, stylesToApply, stylesToRemove])
	}
	deleteText(deleteForwards) {
		return this.callCommandFn('deleteText', [deleteForwards])
	}
	onEnter(shiftKey) {
		return this.callCommandFn('onEnter', [shiftKey])
	}
	splitText() {
		return this.callCommandFn('splitText')
	}
	deleteSelection() {
		return this.callCommandFn('deleteSelection')
	}
	styleSelection(styleType, styleData) {
		return this.callCommandFn('styleSelection', [styleType, styleData])
	}
	unstyleSelection(styleType, styleData) {
		return this.callCommandFn('unstyleSelection', [styleType, styleData])
	}
	getSelectionStyles() {
		return this.callCommandFn('getSelectionStyles')
	}
	canMergeWith(otherChunk) {
		return this.callCommandFn('canMergeWith', [otherChunk])
	}
	merge(digestedChunk, mergeText) {
		return this.callCommandFn('merge', [digestedChunk, mergeText])
	}
	indent(decreaseIndent) {
		return this.callCommandFn('indent', [decreaseIndent])
	}
	onTab(untab) {
		return this.callCommandFn('onTab', [untab])
	}
	acceptAbsorb(consumerChunk) {
		return this.callCommandFn('acceptAbsorb', [consumerChunk])
	}
	absorb(digestedChunk) {
		return this.callCommandFn('absorb', [digestedChunk])
	}
	replaceSelection() {
		return this.callCommandFn('replaceSelection')
	}
	split() {
		return this.callCommandFn('split')
	}
	getDOMStateBeforeInput() {
		return this.callCommandFn('getDOMStateBeforeInput')
	}
	getDOMModificationAfterInput(domStateBefore) {
		return this.callCommandFn('getDOMModificationAfterInput', [domStateBefore])
	}
	applyDOMModification(domModifications) {
		return this.callCommandFn('applyDOMModification', [domModifications])
	}
	onSelectAll() {
		return this.callCommandFn('onSelectAll')
	}
	getTextMenuCommands() {
		return this.callCommandFn('getTextMenuCommands')
	}
	paste(text, html, chunks) {
		return this.callCommandFn('paste', [text, html, chunks])
	}
	getCopyOfSelection(cloneId) {
		return this.callSelectionFn('getCopyOfSelection', [cloneId])
	}
	selectStart(asRange) {
		return this.callSelectionFn('selectStart', [asRange])
	}
	selectEnd(asRange) {
		return this.callSelectionFn('selectEnd', [asRange])
	}
	selectAll() {
		return this.callSelectionFn('selectAll')
	}
	getVirtualSelectionStartData() {
		return this.callSelectionFn('getVirtualSelectionStartData')
	}
	getVirtualSelectionEndData() {
		return this.callSelectionFn('getVirtualSelectionEndData')
	}
	getDOMSelectionStart() {
		return this.callSelectionFn('getDOMSelectionStart')
	}
	getDOMSelectionEnd() {
		return this.callSelectionFn('getDOMSelectionEnd')
	}
	areCursorsEquivalent(thisCursorData, otherCursorData) {
		return this.callSelectionFn('areCursorsEquivalent', [thisCursorData, otherCursorData])
	}
	highlightSelection(comment) {
		return this.callSelectionFn('highlightSelection', [comment])
	}
}
Chunk.initClass()

Chunk.create = function(typeOrClass, content) {
	let chunk, componentClass
	if (typeOrClass == null) {
		typeOrClass = null
	}
	if (content == null) {
		content = null
	}
	try {
		let type
		if (typeOrClass == null) {
			componentClass = OBO.componentClassMap.defaultClass
			type = OBO.componentClassMap.getTypeOfClass(componentClass)
		} else if (typeof typeOrClass === 'string') {
			componentClass = OBO.componentClassMap.getClassForType(typeOrClass)
			type = typeOrClass
		} else {
			componentClass = typeOrClass
			type = OBO.componentClassMap.getTypeOfClass(typeOrClass)
		}

		if (content == null) {
			content = componentClass.createNewNodeData()
		}

		chunk = new Chunk({
			type
		})
		chunk.modelState = content
	} catch (e) {
		throw e
		componentClass = OBO.componentClassMap.errorClass
		chunk = new Chunk(componentClass)
	}

	return chunk
}

export default Chunk

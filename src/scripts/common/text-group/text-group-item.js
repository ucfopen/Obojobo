let TextGroupItem
import StyleableText from '../../common/text/styleable-text'
import Util from './text-group-util'

export default (TextGroupItem = class TextGroupItem {
	constructor(text, data, parent) {
		if (text == null) {
			text = new StyleableText()
		}
		this.text = text
		if (data == null) {
			data = {}
		}
		this.data = data
		if (parent == null) {
			parent = null
		}
		this.parent = parent
	}

	clone(cloneDataFn) {
		if (cloneDataFn == null) {
			cloneDataFn = Util.defaultCloneFn
		}
		return new TextGroupItem(this.text.clone(), cloneDataFn(this.data), null)
	}
})

Object.defineProperties(TextGroupItem.prototype, {
	index: {
		get() {
			if (this.parent === null) {
				return -1
			}
			return this.parent.indexOf(this)
		}
	}
})

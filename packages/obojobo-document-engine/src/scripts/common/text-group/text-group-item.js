import StyleableText from '../../common/text/styleable-text'
import Util from './text-group-util'

class TextGroupItem {
	constructor(text = null, data = {}, parent = null) {
		if (text === null) text = new StyleableText()

		this.text = text
		this.data = data
		this.parent = parent
	}

	clone(cloneDataFn = Util.defaultCloneFn) {
		return new TextGroupItem(this.text.clone(), cloneDataFn(this.data), null)
	}

	get index() {
		return this.parent === null ? -1 : this.parent.indexOf(this)
	}
}

export default TextGroupItem

const getDefaultBulletStyle = function(indent, type) {
	const defaults = type === 'ordered' ? orderedDefaultBulletStyles : unorderedDefaultBulletStyles
	return defaults[indent % defaults.length]
}

const getStyleWithDefaults = function(indent, defaultType, style = null) {
	const styleWithDefaults = new ListStyle()

	styleWithDefaults.type = style && style.type ? style.type : defaultType
	styleWithDefaults.start = style && style.start !== null ? style.start : 1
	styleWithDefaults.bulletStyle =
		style && style.bulletStyle
			? style.bulletStyle
			: getDefaultBulletStyle(indent, styleWithDefaults.type)

	return styleWithDefaults
}

class ListStyle {
	constructor(opts = {}) {
		this.type = opts.type || null
		this.start = opts.start || null
		this.bulletStyle = opts.bulletStyle || null
	}

	toDescriptor() {
		return {
			type: this.type || null,
			start: this.start || null,
			bulletStyle: this.bulletStyle || null
		}
	}

	clone() {
		return new ListStyle(this)
	}
}

class ListStyles {
	constructor(type) {
		this.type = type
		this.styles = {}
	}

	init() {
		this.type = ListStyles.TYPE_UNORDERED
		this.styles = {}
	}

	set(indent, opts) {
		this.styles[indent] = new ListStyle(opts)
	}

	get(indent) {
		return getStyleWithDefaults(indent, this.type, this.styles[indent])
	}

	getSetStyles(indent) {
		const style = this.styles[indent]
		if (!style) {
			return new ListStyle()
		}

		return style
	}

	toDescriptor() {
		const desc = {
			type: this.type,
			indents: {}
		}

		for (const indent in this.styles) {
			const style = this.styles[indent]
			desc.indents[indent] = style.toDescriptor()
		}

		return desc
	}

	clone() {
		const clone = new ListStyles(this.type)

		for (const indent in this.styles) {
			const style = this.styles[indent]
			clone.styles[indent] = style.clone()
		}

		return clone
	}

	map(fn) {
		const result = []

		for (const indent in this.styles) {
			const style = this.styles[indent]
			result.push(fn(style, indent))
		}

		return result
	}
}

ListStyles.fromDescriptor = function(descriptor) {
	const styles = new ListStyles(descriptor.type)

	for (const indent in descriptor.indents) {
		const style = descriptor.indents[indent]
		styles.set(indent, style)
	}

	return styles
}

ListStyles.TYPE_ORDERED = 'ordered'
ListStyles.TYPE_UNORDERED = 'unordered'

ListStyles.STYLE_FILLED_CIRCLE = 'disc'
ListStyles.STYLE_HOLLOW_CIRCLE = 'circle'
ListStyles.STYLE_SQUARE = 'square'

ListStyles.STYLE_NUMERIC = 'decimal'
ListStyles.STYLE_LEAD_ZERO_NUMERIC = 'decimal-leading-zero'
ListStyles.STYLE_LOWERCASE_LETTER = 'lower-alpha'
ListStyles.STYLE_UPPERCASE_LETTER = 'upper-alpha'
ListStyles.STYLE_LOWERCASE_ROMAN = 'lower-roman'
ListStyles.STYLE_UPPERCASE_ROMAN = 'upper-roman'

const unorderedDefaultBulletStyles = [
	ListStyles.STYLE_FILLED_CIRCLE,
	ListStyles.STYLE_HOLLOW_CIRCLE,
	ListStyles.STYLE_SQUARE
]

const orderedDefaultBulletStyles = [
	ListStyles.STYLE_NUMERIC,
	ListStyles.STYLE_UPPERCASE_LETTER,
	ListStyles.STYLE_UPPERCASE_ROMAN,
	ListStyles.STYLE_LOWERCASE_LETTER,
	ListStyles.STYLE_LOWERCASE_ROMAN
]

export default ListStyles

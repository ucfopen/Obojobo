getDefaultBulletStyle = (indent, type) ->
	defaults = if type is 'ordered' then orderedDefaultBulletStyles else unorderedDefaultBulletStyles
	defaults[indent % defaults.length]

getStyleWithDefaults = (indent, defaultType, style = null) ->
	styleWithDefaults = new ListStyle

	styleWithDefaults.type        = if style?.type        then style.type        else defaultType
	styleWithDefaults.start       = if style?.start       then style.start       else 1
	styleWithDefaults.bulletStyle = if style?.bulletStyle then style.bulletStyle else getDefaultBulletStyle(indent, styleWithDefaults.type)

	styleWithDefaults


class ListStyle
	constructor: (opts = {}) ->
		@type = opts.type || null
		@start = opts.start || null
		@bulletStyle = opts.bulletStyle || null

	toDescriptor: ->
		type: @type || null
		start: @start || null
		bulletStyle: @bulletStyle || null

	clone: ->
		new ListStyle @


class ListStyles
	constructor: (type) ->
		@type = type
		@styles = {}

	init: ->
		@type = ListStyles.TYPE_UNORDERED
		@styles = {}

	set: (indent, opts) ->
		@styles[indent] = new ListStyle opts

	get: (indent) ->
		getStyleWithDefaults indent, @type, @styles[indent]

	getSetStyles: (indent) ->
		style = @styles[indent]
		if not style then return new ListStyle

		style

	toDescriptor: ->
		desc =
			type: @type
			indents: {}

		for indent, style of @styles
			desc.indents[indent] = style.toDescriptor()

		desc

	clone: ->
		clone = new ListStyles @type

		for indent, style of @styles
			clone.styles[indent] = style.clone()

		clone

	map: (fn) ->
		for indent, style of @styles
			fn style, indent


ListStyles.fromDescriptor = (descriptor) ->
	styles = new ListStyles descriptor.type

	for indent, style of descriptor.indents
		styles.set indent, style

	styles

ListStyles.TYPE_ORDERED = 'ordered'
ListStyles.TYPE_UNORDERED = 'unordered'

ListStyles.STYLE_FILLED_CIRCLE = 'disc'
ListStyles.STYLE_HOLLOW_CIRCLE = 'circle'
ListStyles.STYLE_SQUARE        = 'square'

ListStyles.STYLE_NUMERIC           = 'decimal'
ListStyles.STYLE_LEAD_ZERO_NUMERIC = 'decimal-leading-zero'
ListStyles.STYLE_LOWERCASE_LETTER  = 'lower-alpha'
ListStyles.STYLE_UPPERCASE_LETTER  = 'upper-alpha'
ListStyles.STYLE_LOWERCASE_ROMAN   = 'lower-roman'
ListStyles.STYLE_UPPERCASE_ROMAN   = 'upper-roman'


unorderedDefaultBulletStyles = [
	ListStyles.STYLE_FILLED_CIRCLE,
	ListStyles.STYLE_HOLLOW_CIRCLE,
	ListStyles.STYLE_SQUARE
]

orderedDefaultBulletStyles   = [
	ListStyles.STYLE_NUMERIC,
	ListStyles.STYLE_UPPERCASE_LETTER,
	ListStyles.STYLE_UPPERCASE_ROMAN,
	ListStyles.STYLE_LOWERCASE_LETTER,
	ListStyles.STYLE_LOWERCASE_ROMAN
]


module.exports = ListStyles
let getDefaultBulletStyle = function(indent, type) {
	let defaults = type === 'ordered' ? orderedDefaultBulletStyles : unorderedDefaultBulletStyles;
	return defaults[indent % defaults.length];
};

let getStyleWithDefaults = function(indent, defaultType, style) {
	if (style == null) { style = null; }
	let styleWithDefaults = new ListStyle;

	styleWithDefaults.type        = (style != null ? style.type : undefined)        ? style.type        : defaultType;
	styleWithDefaults.start       = (style != null ? style.start : undefined)       ? style.start       : 1;
	styleWithDefaults.bulletStyle = (style != null ? style.bulletStyle : undefined) ? style.bulletStyle : getDefaultBulletStyle(indent, styleWithDefaults.type);

	return styleWithDefaults;
};


class ListStyle {
	constructor(opts) {
		if (opts == null) { opts = {}; }
		this.type = opts.type || null;
		this.start = opts.start || null;
		this.bulletStyle = opts.bulletStyle || null;
	}

	toDescriptor() {
		return {
			type: this.type || null,
			start: this.start || null,
			bulletStyle: this.bulletStyle || null
		};
	}

	clone() {
		return new ListStyle(this);
	}
}


class ListStyles {
	constructor(type) {
		this.type = type;
		this.styles = {};
	}

	init() {
		this.type = ListStyles.TYPE_UNORDERED;
		return this.styles = {};
	}

	set(indent, opts) {
		return this.styles[indent] = new ListStyle(opts);
	}

	get(indent) {
		return getStyleWithDefaults(indent, this.type, this.styles[indent]);
	}

	getSetStyles(indent) {
		let style = this.styles[indent];
		if (!style) { return new ListStyle; }

		return style;
	}

	toDescriptor() {
		let desc = {
			type: this.type,
			indents: {}
		};

		for (let indent in this.styles) {
			let style = this.styles[indent];
			desc.indents[indent] = style.toDescriptor();
		}

		return desc;
	}

	clone() {
		let clone = new ListStyles(this.type);

		for (let indent in this.styles) {
			let style = this.styles[indent];
			clone.styles[indent] = style.clone();
		}

		return clone;
	}

	map(fn) {
		return (() => {
			let result = [];
			for (let indent in this.styles) {
				let style = this.styles[indent];
				result.push(fn(style, indent));
			}
			return result;
		})();
	}
}


ListStyles.fromDescriptor = function(descriptor) {
	let styles = new ListStyles(descriptor.type);

	for (let indent in descriptor.indents) {
		let style = descriptor.indents[indent];
		styles.set(indent, style);
	}

	return styles;
};

ListStyles.TYPE_ORDERED = 'ordered';
ListStyles.TYPE_UNORDERED = 'unordered';

ListStyles.STYLE_FILLED_CIRCLE = 'disc';
ListStyles.STYLE_HOLLOW_CIRCLE = 'circle';
ListStyles.STYLE_SQUARE        = 'square';

ListStyles.STYLE_NUMERIC           = 'decimal';
ListStyles.STYLE_LEAD_ZERO_NUMERIC = 'decimal-leading-zero';
ListStyles.STYLE_LOWERCASE_LETTER  = 'lower-alpha';
ListStyles.STYLE_UPPERCASE_LETTER  = 'upper-alpha';
ListStyles.STYLE_LOWERCASE_ROMAN   = 'lower-roman';
ListStyles.STYLE_UPPERCASE_ROMAN   = 'upper-roman';


var unorderedDefaultBulletStyles = [
	ListStyles.STYLE_FILLED_CIRCLE,
	ListStyles.STYLE_HOLLOW_CIRCLE,
	ListStyles.STYLE_SQUARE
];

var orderedDefaultBulletStyles   = [
	ListStyles.STYLE_NUMERIC,
	ListStyles.STYLE_UPPERCASE_LETTER,
	ListStyles.STYLE_UPPERCASE_ROMAN,
	ListStyles.STYLE_LOWERCASE_LETTER,
	ListStyles.STYLE_LOWERCASE_ROMAN
];


export default ListStyles;
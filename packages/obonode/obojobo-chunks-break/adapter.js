const Adapter = {
	construct(model) {
		model.setStateProp('width', 'normal', p => p.toLowerCase(), ['normal', 'large'])
	},

	toText() {
		return '---'
	}
}

export default Adapter

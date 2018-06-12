import Common from 'Common'

const setModelStateProp = Common.util.setModelStateProp

export default {
	construct(model, attrs) {
		const s = setModelStateProp.bind(this, model, attrs)

		s('type', 'media', p => (p.toLowerCase() === 'webpage' ? 'webpage' : 'media'))

		let defaultNewWindow
		let defaultBorder
		let defaultFit
		let defaultControls

		switch (model.modelState.type) {
			case 'webpage':
				defaultNewWindow = true
				defaultBorder = true
				defaultFit = 'scroll'
				defaultControls = ['zoom', 'reload', 'expand']
				break

			case 'media':
			default:
				defaultNewWindow = false
				defaultBorder = false
				defaultFit = 'scale'
				defaultControls = ['reload', 'expand']
				break
		}

		s('newWindow', defaultNewWindow, p => p === true)
		s('border', defaultBorder)
		s('fit', defaultFit, p => p.toLowerCase(), ['scroll', 'scale'])
		s('src', null)
		s('width', null, p => parseInt(p, 10) || null)
		s('height', null, p => parseInt(p, 10) || null)
		s('zoom', 1, p => parseFloat(p) || 1)
		s('newWindowSrc', null)
		s('autoload', false, p => p === true)
		s('title', null)
		s('controls', defaultControls, p => p.split(',').map(c => c.toLowerCase().replace(/ /g, '')))
		s('expandedSize', 'full', p => p.toLowerCase(), ['full', 'restricted'])
	},

	clone(model, clone) {
		clone.modelState.type = model.modelState.type
		clone.modelState.src = model.modelState.src
		clone.modelState.width = model.modelState.width
		clone.modelState.height = model.modelState.height
		clone.modelState.zoom = model.modelState.zoom
		clone.modelState.border = model.modelState.border
		clone.modelState.newWindow = model.modelState.newWindow
		clone.modelState.newWindowSrc = model.modelState.newWindowSrc
		clone.modelState.autoload = model.modelState.autoload
		clone.modelState.fit = model.modelState.fit
		clone.modelState.expandedSize = model.modelState.expandedSize
		clone.modelState.title = model.modelState.title
		clone.modelState.controls = model.modelState.controls
	},

	toJSON(model, json) {
		json.content.type = model.modelState.type
		json.content.src = model.modelState.src
		json.content.width = model.modelState.width
		json.content.height = model.modelState.height
		json.content.zoom = model.modelState.zoom
		json.content.border = model.modelState.border
		json.content.newWindow = model.modelState.newWindow
		json.content.newWindowSrc = model.modelState.newWindowSrc
		json.content.autoload = model.modelState.autoload
		json.content.fit = model.modelState.fit
		json.content.expandedSize = model.modelState.expandedSize
		json.content.title = model.modelState.title
		json.content.controls = model.modelState.controls
	},

	toText(model) {
		return model.modelState.src
	}
}

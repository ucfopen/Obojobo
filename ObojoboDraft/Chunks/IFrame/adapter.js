import Common from 'Common'

import IFrameMediaTypes from './iframe-media-types'
import IFrameFitTypes from './iframe-fit-types'
import IFrameControlTypes from './iframe-control-types'

const setModelStateProp = Common.util.setModelStateProp
const cloneProps = Common.util.cloneProps
const propsList = [
	'type',
	'src',
	'width',
	'height',
	'zoom',
	'border',
	'autoload',
	'fit',
	'title',
	'controls'
]

export default {
	construct(model, attrs) {
		const s = model.setModelStateProp.bind(model)

		s('type', IFrameMediaTypes.MEDIA, p => p.toLowerCase(), [
			IFrameMediaTypes.WEBPAGE,
			IFrameMediaTypes.MEDIA
		])

		let defaultBorder
		let defaultFit
		let defaultControls

		switch (model.modelState.type) {
			case IFrameMediaTypes.WEBPAGE:
				defaultBorder = true
				defaultFit = IFrameFitTypes.SCROLL
				defaultControls = [
					IFrameControlTypes.ZOOM,
					IFrameControlTypes.RELOAD,
					IFrameControlTypes.NEW_WINDOW
				]
				break

			case IFrameMediaTypes.MEDIA:
			default:
				defaultBorder = false
				defaultFit = IFrameFitTypes.SCALE
				defaultControls = [IFrameControlTypes.RELOAD]
				break
		}

		s('border', defaultBorder)
		s('fit', defaultFit, p => p.toLowerCase(), [IFrameFitTypes.SCROLL, IFrameFitTypes.SCALE])
		s('src', null)
		s('width', null, p => parseInt(p, 10) || null)
		s('height', null, p => parseInt(p, 10) || null)
		s('initialZoom', 1, p => parseFloat(p) || 1)
		s('autoload', false, p => p === true)
		s('title', null)
		s('controls', defaultControls, p => p.split(',').map(c => c.toLowerCase().replace(/ /g, '')))
	},

	clone(model, clone) {
		cloneProps(clone.modelState, model.modelState, propsList)
	},

	toJSON(model, json) {
		cloneProps(json.content, model.modelState, propsList)
	},

	toText(model) {
		return model.modelState.src
	}
}

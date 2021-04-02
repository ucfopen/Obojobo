import Common from 'obojobo-document-engine/src/scripts/common'

import IFrameMediaTypes from './iframe-media-types'
import IFrameFitTypes from './iframe-fit-types'
import IFrameControlTypes from './iframe-control-types'
import IFrameSizingTypes from './iframe-sizing-types'

const cloneProps = Common.util.cloneProps
const propsList = [
	'type',
	'src',
	'width',
	'height',
	'initialZoom',
	'border',
	'autoload',
	'fit',
	'title',
	'controls',
	'sizing'
]

export default {
	construct(model) {
		model.setStateProp('type', IFrameMediaTypes.MEDIA, p => p.toLowerCase(), [
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

		model.setStateProp('border', defaultBorder)
		model.setStateProp('fit', defaultFit, p => p.toLowerCase(), [
			IFrameFitTypes.SCROLL,
			IFrameFitTypes.SCALE
		])
		model.setStateProp('src', null)
		model.setStateProp('width', null, p => parseInt(p, 10) || null)
		model.setStateProp('height', null, p => parseInt(p, 10) || null)
		model.setStateProp('initialZoom', 1, p => parseFloat(p) || 1)
		model.setStateProp('autoload', false, p => p === true)
		model.setStateProp('title', null)
		model.setStateProp('controls', defaultControls, p =>
			p.split(',').map(c => c.toLowerCase().replace(/ /g, ''))
		)
		model.setStateProp('sizing', IFrameSizingTypes.FIXED)
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

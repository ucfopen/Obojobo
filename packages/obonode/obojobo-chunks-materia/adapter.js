import cloneProps from 'obojobo-document-engine/src/scripts/common/util/clone-props'
import TextGroupAdapter from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter'
import TextGroup from 'obojobo-document-engine/src/scripts/common/text-group/text-group'
import IFrameControlTypes from 'obojobo-chunks-iframe/iframe-control-types'

const propsList = ['controls', 'height', 'icon', 'src', 'widgetEngine', 'width']

export default {
	construct(model, attrs) {
		// process the caption text
		if (attrs && attrs.content && attrs.content.textGroup) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, 1, {})
		} else {
			model.modelState.textGroup = TextGroup.create(1, {})
		}

		model.setStateProp('src', null)
		model.setStateProp('width', null, p => parseInt(p, 10) || null)
		model.setStateProp('height', null, p => parseInt(p, 10) || null)
		model.setStateProp('widgetEngine', null)
		model.setStateProp('icon', null)
		// iframe controls
		model.setStateProp('controls', [IFrameControlTypes.RELOAD])
	},

	clone(model, clone) {
		TextGroupAdapter.clone(model, clone)
		cloneProps(clone.modelState, model.modelState, propsList)
	},

	toJSON(model, json) {
		TextGroupAdapter.toJSON(model, json)
		cloneProps(json.content, model.modelState, propsList)
	},

	toText(model) {
		return model.modelState.src
	}
}

import cloneProps from 'obojobo-document-engine/src/scripts/common/util/clone-props'
import TextGroupAdapter from 'obojobo-document-engine/src/scripts/common/chunk/text-chunk/text-group-adapter'
import TextGroup from 'obojobo-document-engine/src/scripts/common/text-group/text-group'

const MIN_DIMENSION = 100
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600

const propsList = ['height', 'icon', 'src', 'widgetEngine', 'width']

export default {
	construct(model, attrs) {
		// process the caption text
		if (attrs && attrs.content && attrs.content.textGroup) {
			model.modelState.textGroup = TextGroup.fromDescriptor(attrs.content.textGroup, 1, {})
		} else {
			model.modelState.textGroup = TextGroup.create(1, {})
		}

		model.setStateProp('src', null)
		model.setStateProp('width', DEFAULT_WIDTH, p =>
			Number.isFinite(p) && p >= MIN_DIMENSION ? p : null
		)
		model.setStateProp('height', DEFAULT_HEIGHT, p =>
			Number.isFinite(p) && p >= MIN_DIMENSION ? p : null
		)
		model.setStateProp('widgetEngine', null)
		model.setStateProp('icon', null)
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

OboNode = require './obonode'
ComponentClassMap = require '../util/componentclassmap'

descriptorToNode = (descriptor) ->
	data = descriptor.data

	if ComponentClassMap.hasType descriptor.type
		data = ComponentClassMap.getClassForType(descriptor.type).createNodeDataFromDescriptor(descriptor)

	oboNode = new OboNode descriptor.type, data

	if descriptor.children?
		for childDescriptor in descriptor.children
			oboNode.addChild descriptorToNode(childDescriptor)
	oboNode


module.exports = descriptorToNode
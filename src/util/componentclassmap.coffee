nameToClass = new Map
classToName = new Map
consumableElements = new Map
defaultClass = null

ComponentClassMap =
	setDefaultComponentClass: (componentClass) ->
		defaultClass = componentClass

	getDefaultComponentClass: ->
		defaultClass

	register: (type, componentClass) ->
		nameToClass.set type, componentClass
		classToName.set componentClass, type

		if componentClass.consumableElements?
			for el in componentClass.consumableElements
				consumableElements.set el, componentClass

	getClassForType: (type) ->
		nameToClass.get type

	getTypeOfClass: (componentClass) ->
		classToName.get componentClass

	hasType: (type) ->
		nameToClass.has type

	hasClass: (componentClass) ->
		classToName.has componentClass

	getClassForElement: (el) ->
		if consumableElements.has el then return consumableElements.get el
		defaultClass


module.exports = ComponentClassMap
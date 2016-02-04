nameToClass = new Map
classToName = new Map
consumableElements = new Map
inserts = new Map
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

		if componentClass.insertLabel?
			inserts.set componentClass.insertLabel, componentClass

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

	getInserts: ->
		inserts


module.exports = ComponentClassMap
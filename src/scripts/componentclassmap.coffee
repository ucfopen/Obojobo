class ComponentClassMap
	constructor: ->
		@nameToClass = new Map
		@classToName = new Map
		@defaultClass = null
		@errorClass = null

	setDefault: (type) ->
		@defaultClass = @getClassForType type

	# getDefaultComponentClass: ->
	# 	console.log '__________GET DEFAULT CLASS', @defaultClass
	# 	@defaultClass

	setError: (type) ->
		@errorClass = @getClassForType type

	# getErrorComponentClass: ->
	# 	@errorClass

	register: (type, componentClass) ->
		@nameToClass.set type, componentClass
		@classToName.set componentClass, type

	getClassForType: (type) ->
		componentClass = @nameToClass.get type

		if not componentClass?
			return @errorClass

		componentClass

	getTypeOfClass: (componentClass) ->
		@classToName.get componentClass

	hasType: (type) ->
		@nameToClass.has type

	hasClass: (componentClass) ->
		@classToName.has componentClass


module.exports = ComponentClassMap
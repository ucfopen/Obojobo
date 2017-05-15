class ComponentClassMap {
	constructor() {
		this.nameToClass = new Map;
		this.classToName = new Map;
		this.defaultClass = null;
		this.errorClass = null;
	}

	setDefault(type) {
		return this.defaultClass = this.getClassForType(type);
	}

	// getDefaultComponentClass: ->
	// 	console.log '__________GET DEFAULT CLASS', @defaultClass
	// 	@defaultClass

	setError(type) {
		return this.errorClass = this.getClassForType(type);
	}

	// getErrorComponentClass: ->
	// 	@errorClass

	register(type, componentClass) {
		this.nameToClass.set(type, componentClass);
		return this.classToName.set(componentClass, type);
	}

	getClassForType(type) {
		let componentClass = this.nameToClass.get(type);

		if ((componentClass == null)) {
			return this.errorClass;
		}

		return componentClass;
	}

	getTypeOfClass(componentClass) {
		return this.classToName.get(componentClass);
	}

	hasType(type) {
		return this.nameToClass.has(type);
	}

	hasClass(componentClass) {
		return this.classToName.has(componentClass);
	}
}


export default ComponentClassMap;
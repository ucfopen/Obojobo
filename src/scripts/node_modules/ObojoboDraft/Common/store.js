console.log('====IMPORTING OBO')




import ComponentClassMap from './component-class-map';

let componentClassMap = new ComponentClassMap();
let items = new Map();
let itemsLoaded = 0;
let getItemsCallbacks = [];
let defaults = new Map();
// errorChunk = null @TODO

// this is editor stuff only
let insertItems = new Map();
let registeredToolbarItems = {
	'separator': { id:'separator', type:'separator' }
};
let toolbarItems = [];
let textListeners = [];
let triggerActions = {};
let variableHandlers = new Map();

window.__items = items;

class _Store {
	loadDependency(url, onLoadCallback) {
		if (onLoadCallback == null) { onLoadCallback = function() {}; }
		let type = url.substr(url.lastIndexOf('.') + 1);

		switch (type) {
			case 'js':
				let el = document.createElement('script');
				el.setAttribute('src', url);
				el.onload = onLoadCallback;
				document.head.appendChild(el);
				break;

			case 'css':
				el = document.createElement('link');
				el.setAttribute('rel', 'stylesheet');
				el.setAttribute('href', url);
				document.head.appendChild(el);
				onLoadCallback();
				break;
		}

		return this;
	}

	registerModel(className, opts)
	{
		console.log('regsiter', className, opts)
		if (opts == null) { opts = {}; }
		items.set(className, opts);
		// componentClassMap.register chunkClass.type, chunkClass

		opts = Object.assign({
			type: null,
			dependencies: [],
			default: false,
			error: false,
			insertItem: null,
			modelClass: null,
			componentClass: null,
			selectionHandler: null,
			commandHandler: null,
			variables: {},
			init() {}
		}, opts);

		if (opts.default) {
			// componentClassMap.setDefault chunkClass.type
			defaults.set(opts.type, className);
		}
		// if opts.error
		// 	componentClassMap.setError chunkClass.type
		if (opts.insertItem) { insertItems.set(chunkClass.type, opts.insertItem); }

		opts.init();

		for (let variable in opts.variables) {
			let cb = opts.variables[variable];
			variableHandlers.set(variable, cb);
		}

		let { loadDependency } = this;
		let promises = opts.dependencies.map(dependency =>
			new Promise(function(resolve, reject) {
				return loadDependency(dependency, resolve);
			})
		);

		Promise.all(promises).then(function() {
			itemsLoaded++;

			if (itemsLoaded === items.size) {
				for (let callback of Array.from(getItemsCallbacks)) {
					callback(chunks);
				}

				return getItemsCallbacks = [];
			}});

		return this;
	}

	getDefaultItemForModelType(modelType) {
		let type = defaults.get(modelType);
		if (!type) {
			return null;
		}

		return items.get(type);
	}

	getItemForType(type) {
		return items.get(type);
	}

	registerToolbarItem(opts) {
		registeredToolbarItems[opts.id] = opts;
		return this;
	}

	addToolbarItem(id) {
		toolbarItems.push(Object.assign({}, registeredToolbarItems[id]));
		return this;
	}

	registerTextListener(opts, position) {
		if (position == null) { position = -1; }
		if (position > -1) {
			textListeners.splice(position, 0, opts);
		} else {
			textListeners.push(opts);
		}

		return this;
	}

	getItems(callback) {
		if (true || (itemsLoaded === items.size)) {
			callback(items);
		} else {
			getItemsCallbacks.push(callback);
		}

		return null;
	}

	getDefaultItemForType(type) {
		let className = defaults.get(type);
		if ((className == null)) {
			return null;
		}

		return items.get(className);
	}

	getTextForVariable(variable, model, viewerState) {
		let cb = variableHandlers.get(variable);
		if (!cb) { return null; }

		return cb.call(null, model, viewerState);
	}
}


Object.defineProperties(_Store.prototype, {
	// errorChunk:
	// 	get: -> errorChunk

	insertItems: {
		get() { return insertItems; }
	},

	registeredToolbarItems: {
		get() { return registeredToolbarItems; }
	},

	toolbarItems: {
		get() { return toolbarItems; }
	},

	textListeners: {
		get() { return textListeners; }
	},

	triggerActions: {
		get() { return triggerActions; }
	},

	__debug__chunks: {
		get() { return chunks; }
	}
});

let Store = new _Store()
export { Store }
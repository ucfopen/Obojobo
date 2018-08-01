let items,
	itemsLoaded,
	getItemsCallbacks,
	defaults,
	insertItems,
	registeredToolbarItems,
	toolbarItems,
	textListeners,
	variableHandlers

class _Store {
	init() {
		items = new Map()
	}

	registerNode(className, opts) {
		if (opts == null) {
			opts = {}
		}
		items.set(className, opts)

		opts = Object.assign(
			{
				type: null,
				isContent: false,
				node: null,
				insertNode: () => {},
				oboToSlate: () => {},
				slateToObo: () => {},
				plugins: {},
				init() {}
			},
			opts
		)

		if (opts.isContent) {
			content.set(className, opts)
		}

		opts.init()

		return this
	}

	getItemForType(type) {
		return items.get(type)
	}
}

let Store = new _Store()

Store.init()
export { Store }

let items

class _Store {
	init() {
		items = new Map()
	}

	registerModel(className, opts = {}) {
		items.set(className, opts)

		opts = Object.assign(
			{
				type: null,
				default: false,
				insertItem: null,
				componentClass: null,
				selectionHandler: null,
				commandHandler: null,
				variables: {},
				init() {}
			},
			opts
		)

		opts.init()

		return this
	}
}

const Store = new _Store()

Store.init()
export { Store }

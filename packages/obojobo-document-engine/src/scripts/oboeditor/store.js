let items

class _Store {
	init() {
		items = new Map()
	}

	registerModel(className, opts = {}) {
		items.set(className, opts)

		opts = Object.assign(
			{
				name: '',
				icon: null,
				isInsertable: false,
				componentClass: null,
				insertJSON: null,
				plugins: null,
				init() {}
			},
			opts
		)

		opts.init()

		return this
	}

	getModels() {
		console.log(items)
	}
}

const Store = new _Store()

Store.init()
export default Store

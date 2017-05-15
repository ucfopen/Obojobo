import ObojoboDraft from 'ObojoboDraft';
import { OBO } from 'obo';

let { Head } = ObojoboDraft.page;
let { Module } = ObojoboDraft.models;
const { API } = ObojoboDraft.net;

let loadModule = function(id, loadCallback) {
	if (((id != null ? id.length : undefined) != null) && (id.length > 0)) {
		return API.module.get(id, descr =>
			//@TODO
			loadCallback(Module.createFromDescriptor(null, descr))
		);
	} else {
		return loadCallback(new Module);
	}
};

export default function(moduleId, loadCallback) {
	return ObojoboDraft.Store.getItems(chunks =>
		loadModule(moduleId, module =>
			loadCallback({
				module,
				insertItems: OBO.insertItems,
				chunks,
				toolbarItems: OBO.toolbarItems
			})
	));
};

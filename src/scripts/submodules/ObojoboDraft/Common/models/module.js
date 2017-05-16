import Metadata from './metadata';
import PageCollection from './page-collection';
import Page from './page';
import API from 'ObojoboDraft/Common/net/api';

class Module extends Backbone.Model {
	static initClass() {
		this.prototype.urlRoot = "/api/module";
	}
	// idAttribute: "shortId"

	constructor(app, id) {
		if (id == null) { id = null; }
		super();

		this.app = app;
		this.id = id;
		this.metadata = new Metadata();
		this.pages = new PageCollection();
		// @chunks = new ChunkCollection()
		// @savedChunks = {}

		this.pages.on('remove', this.onPageRemove, this);
		this.pages.on('add', this.onPageAdd, this);
		this.pages.on('reset', this.onPagesReset, this);
	}

	initIfNeeded() {
		if (this.pages.models.length === 0) {
			this.pages.add(new Page());
		}

		return Array.from(this.pages.models).map((page) =>
			page.initIfNeeded());
	}

	onPageRemove(model, collection, options) {
		// @savedChunks[model.get('id')] = model.toJSON()
		model.module = null;
		return model.markDirty();
	}
		// @deletedChunks.push model
		// @recalcuateIndices()

	onPageAdd(model, collection, options) {
		console.log('on page add', arguments);
		model.module = this;
		return model.set('draftId', this.id);
	}

		// @recalcuateIndices()

	onPagesReset(collection, options) {
		return Array.from(collection.models).map((page) =>
			((page.module = this),
			page.set('draftId', this.id)));
	}

		// @recalcuateIndices()

	toJSON() {
		return {
			metadata: this.metadata.toJSON(),
			pages: this.pages.toJSON()
		};
	}

	save() {
		// console.log('SAVING')

		this.saveCount = 0;

		for (let chunk of Array.from(this.chunks.models)) {
			if (chunk.dirty) {
				var beforeId;
				this.saveCount++;
				// console.log 'GUNNA SAVE', chunk.modelState.textGroup

				if (chunk.isFirst()) {
					beforeId = null;
				} else {
					beforeId = chunk.prevSibling().id;
				}

				chunk.save({
					before_chunk_id: beforeId
				}, {
					success:this.onSaved.bind(this)
				});
			}
		}

		// console.log 'GONNA DELETE', @deletedChunks.length
		while (this.deletedChunks.length > 0) {
			console.log(this.deletedChunks.length);
			this.deletedChunks.pop().destroy();
		}

		return this.deletedChunks = [];
	}

	onSaved() {
		// console.log 'ON SAVED!', @saveCount
		this.saveCount--;
		if (this.saveCount === 0) {
			// console.log 'UPA DATAA'
			return this.update();
		}
	}



	fromDescriptor(descriptor) {
		this.clear();

		let newModule = Module.createFromDescriptor(this.app, descriptor);

		this.metadata = newModule.metadata;
		this.pages = newModule.pages;

		return this.markDirty();
	}

	markDirty() {
		return Array.from(this.pages.models).map((page) =>
			page.markDirty());
	}

	markForUpdate() {
		return Array.from(this.pages.models).map((page) =>
			page.markForUpdate());
	}

	// saveChunk: (chunk) ->
	// 	@savedChunks[chunk.get('id')] = chunk.toJSON()

	// Includes savedChunks @TODO?
	// getChunkById: (id) ->
	// 	console.log '--get chunk by id', id
	// 	chunk = @chunks.get id
	// 	console.log '----found', chunk
	// 	if not chunk?
	// 		console.log '----dig deeper'
	// 		descriptor = @savedChunks[id]
	// 		if descriptor?
	// 			console.log '----BIRTH'
	// 			console.log descriptor
	// 			chunk = new Chunk(descriptor)
	// 			console.log chunk

	// 	chunk


	__print() {
		// for chunk in @chunks.models
			// console.log chunk.id + ':' + chunk.modelState.textGroup.items.length
		console.log('CHUNKS:');
		return Array.from(this.chunks.models).map((chunk) =>
			((chunk.modelState != null ? chunk.modelState.textGroup : undefined) != null) && (chunk.modelState.textGroup.length !== 0) ?
				(Array.from(chunk.modelState.textGroup.items).map((t) =>
					console.log(chunk.id + '|' + chunk.get('index') + '|' + chunk.get('type') + ':"' + t.text.value + '"')),
				console.log('---'))
			:
				(console.log(chunk.id + '|' + chunk.get('index') + '|' + chunk.get('type') + ':<EMPTY>'),
				console.log('---')));
	}
}
Module.initClass();



Module.createFromDescriptor = function(app, descriptor) {
	let m = new Module(app, descriptor.id);
	// m.metadata = new Metadata descriptor.metadata
	m.metadata = new Metadata();

	let pages = [];
	for (let pageDescriptor of Array.from(descriptor.pages)) {
		pages.push(Page.createFromDescriptor(pageDescriptor));
	}

	m.pages.reset(pages);

	return m;
};



export default Module;
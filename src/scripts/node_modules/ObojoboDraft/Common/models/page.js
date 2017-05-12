import OboModel from './obo-model';
import ChunkCollection from './chunk-collection';
import Chunk from './chunk';

class Page extends OboModel {
	constructor(attrs) {
		super(attrs);

		this.chunks = new ChunkCollection();
		this.deletedChunks = [];

		this.chunks.on('remove', this.onChunkRemove, this);
		this.chunks.on('add', this.onChunkAdd, this);
		this.chunks.on('reset', this.onChunksReset, this);
	}

	initIfNeeded() {
		if (this.chunks.models.length === 0) {
			return this.chunks.add(Chunk.create());
		}
	}

	onChunkRemove(model, collection, options) {
		// @savedChunks[model.get('id')] = model.toJSON()
		model.page = null;
		model.markDirty();
		this.deletedChunks.push(model);
		return this.recalcuateIndices();
	}

	onChunkAdd(model, collection, options) {
		model.page = this;
		model.set('draftId', this.draftId);

		return this.recalcuateIndices();
	}

	onChunksReset(collection, options) {
		for (let chunk of Array.from(collection.models)) {
			chunk.page = this;
			chunk.set('draftId', this.draftId);
		}

		return this.recalcuateIndices();
	}

	recalcuateIndices() {
		return Array.from(this.chunks.models).map((chunk, i) =>
			chunk.set('index', i));
	}

	moveChunk(chunk, newIndex) {
		this.chunks.models.splice(chunk.get('index'), 1)[0];

		this.chunks.models.splice(newIndex, 0, chunk);

		this.recalcuateIndices();

		console.log('@TODO - Need to move chunk on server!');
		return;

		// console.clear()
		return API.chunk.move(chunk, chunk.prevSibling(), (event => {
			// console.clear()
			console.log(event);

			for (chunk of Array.from(this.chunks.models)) {
				console.log(chunk.get('id'));
			}

			return console.log(JSON.parse(event.target.responseText));
		})
		);
	}

	toJSON() {
		return {chunks: this.chunks.toJSON()};
	}

	markDirty() {
		return Array.from(this.chunks.models).map((chunk) =>
			chunk.markDirty());
	}

	markForUpdate() {
		return Array.from(this.chunks.models).map((chunk) =>
			chunk.markForUpdate());
	}
}



Page.createFromDescriptor = function(descriptor) {
	console.log('PAGE CREATE FROM descriptor', descriptor);
	let p = new Page(descriptor);
	// m.metadata = new Metadata de

	let chunks = [];
	for (let chunkDescriptor of Array.from(descriptor.chunks)) {
		try {
			chunkDescriptor.draftId = descriptor.id;
			chunks.push(new Chunk(chunkDescriptor));
		} catch (e) {
			console.error('ERROR', e);
			chunks.push(Chunk.create(OBO.componentClassMap.errorClass));
		}
	}


	if (chunks.length === 0) {
		chunks.push(Chunk.create());
	}

	p.chunks.reset(chunks);

	return p;
};


export default Page;
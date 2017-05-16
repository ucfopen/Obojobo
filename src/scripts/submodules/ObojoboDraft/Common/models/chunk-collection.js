import Chunk from './chunk';

class ChunkCollection extends Backbone.Collection {
	static initClass() {
		this.prototype.model = Chunk;
	}
}
ChunkCollection.initClass();


export default ChunkCollection;
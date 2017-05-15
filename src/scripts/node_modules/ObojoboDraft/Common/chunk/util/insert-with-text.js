import Chunk from 'ObojoboDraft/Common/models/obo-model';

export default function(componentClass, position, referenceChunk, selection, callback) {
	let newChunk = Chunk.create(componentClass);
	let extraChunk = null;

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk);
			if (newChunk.isFirst()) { newChunk.addChildBefore(Chunk.create()); }
			break;

		case 'after':
			referenceChunk.addChildAfter(newChunk);
			if (newChunk.isLast()) { newChunk.addChildAfter(Chunk.create()); }
			break;
	}

	newChunk.selectStart();

	return callback();
};
import Chunk from '../../../common/models/obo-model'

export default function(componentClass, position, referenceChunk, selection, callback) {
	const newChunk = Chunk.create(componentClass)

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk)
			if (newChunk.isFirst()) {
				newChunk.addChildBefore(Chunk.create())
			}
			break

		case 'after':
			referenceChunk.addChildAfter(newChunk)
			if (newChunk.isLast()) {
				newChunk.addChildAfter(Chunk.create())
			}
			break
	}

	newChunk.selectStart()

	return callback()
}

import Chunk from '../../../common/models/obo-model'

export default function(componentClass, position, referenceChunk, selection, callback) {
	const newChunk = Chunk.create(componentClass)

	switch (position) {
		case 'before':
			referenceChunk.addChildBefore(newChunk)
			break
		case 'after':
			referenceChunk.addChildAfter(newChunk)
			break
	}

	newChunk.selectStart()

	return callback()
}

import { Editor, Transforms, Path } from 'slate'

const NormalizeUtil = {
	wrapOrphanedSiblings(editor, entry, wrapper, match) {
		// Collect any orphaned sibling nodes that are next to this node
		const orphanedNodes = [entry]

		// Get siblings before node
		let currNode = entry
		while(currNode) {
			currNode = Editor.previous(editor, { at: currNode[1] })
			// Stop collecting if there are no more siblings or if the sibling is not a match
			// (this prevents non-consecutive orphans from being grouped together)
			if(!currNode || !match(currNode[0])) break

			orphanedNodes.push(currNode)
		}
		// Reverse the orphaned nodes array so siblings are in the proper order
		orphanedNodes.reverse()
		
		// Get siblings after node
		currNode = entry
		while(currNode) {
			currNode = Editor.next(editor, { at: currNode[1] })
			// Stop collecting if there are no more siblings or if the sibling is not a match
			// (this prevents non-consecutive orphans from being grouped together)
			if(!currNode || !match(currNode[0])) break

			orphanedNodes.push(currNode)
		}

		// Wrap orphaned children in a new parent based off of the wrapper 
		const first = orphanedNodes[0]
		const last = orphanedNodes[orphanedNodes.length - 1]
		const firstPath = first[1]
		const lastPath = last[1]

		const range = Editor.range(editor, firstPath, lastPath)
		// Because all of the orphaned nodes are consecutive and at the same level
		// we can insert the wrapper right after the last orphan
		const wrapperPath = Path.next(lastPath)

		Transforms.insertNodes(
			editor, 
			wrapper, 
			{ at: wrapperPath }
		)

		Transforms.moveNodes(editor, {
			at: range,
			match: n => orphanedNodes.map(orphanEntry => orphanEntry[0]).includes(n),
			to: wrapperPath.concat(0),
		})
	}
}

export default NormalizeUtil

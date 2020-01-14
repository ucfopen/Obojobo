import { Editor, Transforms, Path } from 'slate'

const NormalizeUtil = {
	wrapOrphanedSiblings(editor, entry, wrapper, match) {
		// Collect any orphaned sibling nodes that are next to this node
		const orphanedNodes = [entry]

		// Get siblings before node
		let currNode = entry
		while(currNode) {
			currNode = Editor.previous(editor, { at: currNode[1] })
			// Stop collecting if there are no more siblings 
			// or if the sibling is not a CodeLine 
			// (this prevents non-consecutive orphans from being grouped together)
			if(!currNode || match(currNode)) break

			orphanedNodes.push(currNode)
		}
		// Reverse the orphaned nodes array so siblings are in the proper order
		orphanedNodes.reverse()
		
		// Get siblings after node
		currNode = entry
		while(currNode) {
			currNode = Editor.next(editor, { at: currNode[1] })
			// Stop collecting if there are no more siblings 
			// or if the sibling is not a CodeLine 
			// (this prevents non-consecutive orphans from being grouped together)
			if(!currNode || match(currNode)) break

			orphanedNodes.push(currNode)
		}

		// Wrap orphaned children in a new Code Parent
		// Based off of the wrapper 
		const first = orphanedNodes[0]
		const last = orphanedNodes[orphanedNodes.length - 1]
		const firstPath = first[1]
		const lastPath = last[1]
		const commonPath = Path.equals(firstPath, lastPath)
			? Path.parent(firstPath)
			: Path.common(firstPath, lastPath)

		const range = Editor.range(editor, firstPath, lastPath)
		const depth = commonPath.length + 1
		const wrapperPath = Path.next(lastPath.slice(0, depth))

		Transforms.insertNodes(
			editor, 
			wrapper, 
			{ at: wrapperPath })

		Transforms.moveNodes(editor, {
			at: range,
			match: n => orphanedNodes.map(orphanEntry => orphanEntry[0]).includes(n),
			to: wrapperPath.concat(0),
		})
	}
}

export default NormalizeUtil

import { Editor, Transforms } from 'slate'

const SelectionUtil = {
	/**
	 * Reset a selection point when changing between nodes of different depths
	 * This is promarily used when converting to and from lists, as the nested levels
	 * cause the selection to be lost
	 * 
	 * @param {Object} editor A Slate editor
	 * @param {Array} path The path to the Obojobo node
	 * @param {Object} point The original point that needs to be reset
	 * @param {Array} leafPath The path to the leaf-most Element that contained the point (a child of path before conversion)
	 * @param {String} leafSubtype The subtype of the leaf-most node that the new point will be inside
	 * @param {start | anchor | end | focus} edge Which selection point is being set
	 */

	resetPointAtUncertainDepth(editor, path, point, leafPath, leafSubtype, edge) {
		// Since the depth is uncertian, we use the given path to find any matching children
		// If we are resetting the start || anchor, we want the first node
		// Otherwise (resetting end or focus), we want the last node
		const [foundNode] = Array.from(
			Editor.nodes(editor, {
				at: path,
				match: n => n.subtype === leafSubtype,
				reverse: edge === 'end' || edge ==='focus'
			})
		)

		// The difference between startPath and start Point indicates what inline
		// and what text leaf is currently selected
		const leafDepth = point.path.length - leafPath.length
		const relativeLeafPath = point.path.slice(point.path.length - leafDepth)

		// Therefore, the point to focus on is
		// the line's path
		// + the relative leaf path
		// + the original offset
		Transforms.setPoint(
			editor,
			{
				path: foundNode[1].concat(relativeLeafPath),
				offset: point.offset
			},
			{ edge }
		)
	}
}

export default SelectionUtil

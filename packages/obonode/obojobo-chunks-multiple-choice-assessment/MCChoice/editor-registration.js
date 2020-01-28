import React from 'react'
import { Node, Element, Transforms, Text, Editor } from 'slate'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'

import EditorComponent from './editor-component'
import Schema from './schema'
import Converter from './converter'

const MCASSESSMENT_NODE = 'ObojoboDraft.Chunks.MCAssessment'
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const MCFEEDBACK_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const MCChoice = {
	name: MCCHOICE_NODE,
	menuLabel: 'Multiple Choice Choice',
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	plugins: {
		// Editor Plugins - These get attached to the editor object and override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a MCChoice, only allow 1 MCAnswer and 1 MCFeedback
			if (Element.isElement(node) && node.type === MCCHOICE_NODE) {
				let index = 0
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first node should be a MCAnswer
					if(index === 0 && Element.isElement(child) && child.type !== MCANSWER_NODE) {
						// If the first child is a MCFEEDBACK, insert a MCAnswer above it
						if(child.type === MCFEEDBACK_NODE) {
							Transforms.insertNodes(
								editor,
								{
									type: MCANSWER_NODE,
									content: {},
									children: [
										{
											type: TEXT_NODE,
											content: {},
											children: [
												{
													type: TEXT_NODE,
													subtype: TEXT_LINE_NODE,
													content: { indent: 0 },
													children: [{ text: '' }]
												}
											]
										}
									]
								},
								{ at: childPath }
							)
						}

						// Otherwise, wrap the child in a MCAnswer and let MCAnswer
						// normalization decide what to do with it
						Transforms.wrapNodes(
							editor, 
							{
								type: MCANSWER_NODE,
								content: {}
							},
							{ at: childPath }
						)
						return
					}

					// The second node should be an (optional) MCFeedback
					// If it is not, remove it
					if (index === 1 && Element.isElement(child) && child.type !== MCFEEDBACK_NODE) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// A MCChoice should not ever have more than 2 nodes
					if(index > 1) {
						Transforms.removeNodes(editor, { at: childPath })
						return
					}

					// Wrap loose text children in a MCAnswer Node
					// This will result in subsequent normalizations to wrap it in a text node
					if (Text.isText(child)) {
						Transforms.wrapNodes(
							editor, 
							{
								type: MCANSWER_NODE,
								content: {}
							},
							{ at: childPath }
						)
						return
					}

					index++
				}

				// MCChoice parent normalization
				// Note - collects up all MCChoice sibilngs, 
				// as well as any orphaned MCFeedback and MCAnswer
				const [parent] = Editor.parent(editor, path)
				if(!Element.isElement(parent) || parent.type !== MCASSESSMENT_NODE) {
					NormalizeUtil.wrapOrphanedSiblings(
						editor, 
						entry, 
						{ 
							type: MCASSESSMENT_NODE, 
							content: {
								responseType: 'pick-one',
								shuffle: false
							},
							questionType: 'default',
							children: []
						}, 
						node => node.type === MCCHOICE_NODE || node.type === MCFEEDBACK_NODE || node.type === MCANSWER_NODE
					)
					return
				}
			}

			next(entry, editor)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		},
		schema: Schema
	}
}

export default MCChoice

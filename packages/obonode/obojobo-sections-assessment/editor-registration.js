import React from 'react'
import NormalizeUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/normalize-util'
import { Transforms, Node } from 'slate'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'

import EditorComponent from './editor-component'
import Converter from './converter'
import emptyNode from './empty-node.json'

const Assessment = {
	name: ASSESSMENT_NODE,
	isInsertable: false,
	supportsChildren: true,
	helpers: Converter,
	getNavItem(model) {
		const title = model.title || 'Assessment'
		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		}
	},
	plugins: {
		// Editor Plugins - These get attached to the editor object an override it's default functions
		// They may affect multiple nodes simultaneously
		normalizeNode(entry, editor, next) {
			const [node, path] = entry

			// If the element is a Assessment Node, make sure it has the correct children
			if (node.type === ASSESSMENT_NODE) {
				let index = 0
				for (const [child, childPath] of Node.children(editor, path)) {
					// The first child should be a page
					if(index === 0 && child.type !== PAGE_NODE){
						// If the page is entirely missing, remake it 
						if(child.type === QUESTION_BANK_NODE || child.type === ACTIONS_NODE || child.type === RUBRIC_NODE){
							Transforms.insertNodes(
								editor, 
								JSON.parse(JSON.stringify(emptyNode.children[0])), 
								{ at: childPath }
							)
							return
						// Otherwise it probably got unwrapped somehow
						} else {
							NormalizeUtil.wrapOrphanedSiblings(
								editor, 
								[child, childPath], 
								{ type: PAGE_NODE,  content: {}, children: []}, 
								node => node.type !== QUESTION_BANK_NODE || node.type !== ACTIONS_NODE || node.type !== RUBRIC_NODE
							)
							return
						}
					}

					// The second child should be a question bank
					if(index === 1 && child.type !== QUESTION_BANK_NODE){
						// If the questionbank is entirely missing, remake it 
						if(child.type === ACTIONS_NODE || child.type === RUBRIC_NODE){
							Transforms.insertNodes(
								editor, 
								JSON.parse(JSON.stringify(emptyNode.children[1])), 
								{ at: childPath }
							)
							return
						// Otherwise it probably got unwrapped somehow
						} else {
							NormalizeUtil.wrapOrphanedSiblings(
								editor, 
								[child, childPath], 
								{ 
									type: QUESTION_BANK_NODE,  
									content: {
										choose: 1,
										chooseAll: true,
										select: "sequential"
									}, 
									children: []
								}, 
								node => node.type !== PAGE_NODE || node.type !== ACTIONS_NODE || node.type !== RUBRIC_NODE
							)
							return
						}
					}

					// The third child should be an Acrtions node
					if(index === 2 && child.type !== ACTIONS_NODE){
						// If the actions are entirely missing, remake them
						if(child.type === RUBRIC_NODE){
							Transforms.insertNodes(
								editor, 
								JSON.parse(JSON.stringify(emptyNode.children[2])), 
								{ at: childPath }
							)
							return
						// Otherwise it probably got unwrapped somehow
						} else {
							NormalizeUtil.wrapOrphanedSiblings(
								editor, 
								[child, childPath], 
								{ 
									type: ACTIONS_NODE,  
									content: {}, 
									children: []
								}, 
								node => node.type !== PAGE_NODE || node.type !== QUESTION_BANK_NODE || node.type !== RUBRIC_NODE
							)
							return
						}
					}

					index++
				}

				if (node.children.length < 1) {
					Transforms.insertNodes(editor, {
						type: PAGE_NODE,
						content: {},
						children:[{ text: '' }]
					}, { at: path.concat(0) })
					return
				}

				if (node.children.length < 2) {
					Transforms.insertNodes(editor, {
						type: QUESTION_BANK_NODE,
						content: {
							choose: 1,
							chooseAll: true,
							select: "sequential"
						},
						children: [{ text: '' }]
					}, { at: path.concat(1) })
					return
				}

				if (node.children.length < 3) {
					Transforms.insertNodes(editor, {
						type: ACTIONS_NODE,
						content: {},
						children: [{ text: '' }]
					}, { at: path.concat(2) })
					return
				}

				if (node.children.length < 4) {
					Transforms.insertNodes(editor,{
						type: RUBRIC_NODE,
						content: {
							type: 'highest',
							failedResult: 0,
							passedResult: 100,
							unableToPassResult: 0,
							passingAttemptScore: 100,
							passedType: 'set-value',
							failedType: 'set-value',
							unableToPassType: 'no-value',
							mods: []
						},
						children: [{ text: '' }]
					}, { at: path.concat(3) })
					return
				}
			}

			next(entry, editor)
		},
		// Editable Plugins - These are used by the PageEditor component to augment React functions
		// They affect individual nodes independently of one another
		renderNode(props) {
			return <EditorComponent {...props} {...props.attributes} />
		}
	},
}

export default Assessment

import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import wrapLevelOrTab from './wrap-level-or-tab'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('List Wrap Level', () => {
	test('wrapLevelOrTab calls Transforms.wrapNodes on a deeply nested list', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LEVEL_NODE,
									content: { type: 'unordered', bulletStyle: 'disc' },
									children: [
										{
											type: LIST_NODE,
											subtype: LIST_LEVEL_NODE,
											content: { type: 'unordered', bulletStyle: 'disc' },
											children: [
												{
													type: LIST_NODE,
													subtype: LIST_LEVEL_NODE,
													content: { type: 'unordered', bulletStyle: 'disc' },
													children: [
														{
															type: LIST_NODE,
															subtype: LIST_LEVEL_NODE,
															content: { type: 'unordered', bulletStyle: 'disc' },
															children: [
																{
																	type: LIST_NODE,
																	subtype: LIST_LEVEL_NODE,
																	content: { type: 'unordered', bulletStyle: 'disc' },
																	children: [
																		{
																			type: LIST_NODE,
																			subtype: LIST_LEVEL_NODE,
																			content: { type: 'unordered', bulletStyle: 'disc' },
																			children: [
																				{
																					type: LIST_NODE,
																					subtype: LIST_LEVEL_NODE,
																					content: { type: 'unordered', bulletStyle: 'disc' },
																					children: [
																						{
																							type: LIST_NODE,
																							subtype: LIST_LEVEL_NODE,
																							content: { type: 'unordered', bulletStyle: 'disc' },
																							children: [
																								{
																									type: LIST_NODE,
																									subtype: LIST_LEVEL_NODE,
																									content: { type: 'unordered', bulletStyle: 'disc' },
																									children: [
																										{
																											type: LIST_NODE,
																											subtype: LIST_LEVEL_NODE,
																											content: { type: 'unordered', bulletStyle: 'disc' },
																											children: [
																												{
																													type: LIST_NODE,
																													subtype: LIST_LEVEL_NODE,
																													content: { type: 'unordered', bulletStyle: 'disc' },
																													children: [
																														{
																															type: LIST_NODE,
																															subtype: LIST_LEVEL_NODE,
																															content: { type: 'unordered', bulletStyle: 'disc' },
																															children: [
																																{
																																	type: LIST_NODE,
																																	subtype: LIST_LEVEL_NODE,
																																	content: { type: 'unordered', bulletStyle: 'disc' },
																																	children: [
																																		{
																																			type: LIST_NODE,
																																			subtype: LIST_LEVEL_NODE,
																																			content: { type: 'unordered', bulletStyle: 'disc' },
																																			children: [
																																				{
																																					type: LIST_NODE,
																																					subtype: LIST_LEVEL_NODE,
																																					content: { type: 'unordered', bulletStyle: 'disc' },
																																					children: [
																																						{
																																							type: LIST_NODE,
																																							subtype: LIST_LEVEL_NODE,
																																							content: { type: 'unordered', bulletStyle: 'disc' },
																																							children: [
																																								{
																																									type: LIST_NODE,
																																									subtype: LIST_LEVEL_NODE,
																																									content: { type: 'unordered', bulletStyle: 'disc' },
																																									children: [
																																										{
																																											type: LIST_NODE,
																																											subtype: LIST_LINE_NODE,
																																											content: {},
																																											children: [{ text: 'mockList', b: true }]
																																										}
																																									]
																																								}
																																							]
																																						}
																																					]
																																				}
																																			]
																																		}
																																	]
																																}
																															]
																														}
																													]
																												}
																											]
																										}
																									]
																								}
																							]
																						}
																					]
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		wrapLevelOrTab([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).not.toHaveBeenCalled()
	})

	test('wrapLevelOrTab calls Transforms.wrapNodes on an ordered List', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'ordered', bulletStyle: 'alpha' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		wrapLevelOrTab([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('wrapLevelOrTab calls Transforms.wrapNodes on an unordered List', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0], offset: 0 },
				focus: { path: [0, 0], offset: 0 }
			},
			isVoid: () => false
		}
		const event = { preventDefault: jest.fn() }

		wrapLevelOrTab([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('wrapLevelOrTab calls insertText', () => {
		jest.spyOn(Transforms, 'wrapNodes').mockReturnValueOnce(true)
		ReactEditor.findPath.mockReturnValueOnce([0])

		const editor = {
			children: [
				{
					id: 'mockKey',
					type: LIST_NODE,
					content: {},
					children: [
						{
							type: LIST_NODE,
							subtype: LIST_LEVEL_NODE,
							content: { type: 'unordered', bulletStyle: 'disc' },
							children: [
								{
									type: LIST_NODE,
									subtype: LIST_LINE_NODE,
									content: {},
									children: [{ text: 'mockList', b: true }]
								}
							]
						}
					]
				}
			],
			selection: { 
				anchor: { path: [0, 0], offset: 1 },
				focus: { path: [0, 0], offset: 1 }
			},
			isVoid: () => false,
			insertText: jest.fn()
		}
		const event = { preventDefault: jest.fn() }

		wrapLevelOrTab([editor.children[0],[0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(editor.insertText).toHaveBeenCalled()
	})
})
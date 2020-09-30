import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
jest.mock('slate-react')

import wrapLevel from './wrap-level'

const LIST_NODE = 'ObojoboDraft.Chunks.List'
const LIST_LEVEL_NODE = 'ObojoboDraft.Chunks.List.Level'
const LIST_LINE_NODE = 'ObojoboDraft.Chunks.List.Line'

describe('List Wrap Level', () => {
	test('wrapLevel calls Transforms.wrapNodes on a deeply nested list', () => {
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
																									content: {
																										type: 'unordered',
																										bulletStyle: 'disc'
																									},
																									children: [
																										{
																											type: LIST_NODE,
																											subtype: LIST_LEVEL_NODE,
																											content: {
																												type: 'unordered',
																												bulletStyle: 'disc'
																											},
																											children: [
																												{
																													type: LIST_NODE,
																													subtype: LIST_LEVEL_NODE,
																													content: {
																														type: 'unordered',
																														bulletStyle: 'disc'
																													},
																													children: [
																														{
																															type: LIST_NODE,
																															subtype: LIST_LEVEL_NODE,
																															content: {
																																type: 'unordered',
																																bulletStyle: 'disc'
																															},
																															children: [
																																{
																																	type: LIST_NODE,
																																	subtype: LIST_LEVEL_NODE,
																																	content: {
																																		type: 'unordered',
																																		bulletStyle: 'disc'
																																	},
																																	children: [
																																		{
																																			type: LIST_NODE,
																																			subtype: LIST_LEVEL_NODE,
																																			content: {
																																				type: 'unordered',
																																				bulletStyle: 'disc'
																																			},
																																			children: [
																																				{
																																					type: LIST_NODE,
																																					subtype: LIST_LEVEL_NODE,
																																					content: {
																																						type: 'unordered',
																																						bulletStyle: 'disc'
																																					},
																																					children: [
																																						{
																																							type: LIST_NODE,
																																							subtype: LIST_LEVEL_NODE,
																																							content: {
																																								type: 'unordered',
																																								bulletStyle: 'disc'
																																							},
																																							children: [
																																								{
																																									type: LIST_NODE,
																																									subtype: LIST_LEVEL_NODE,
																																									content: {
																																										type:
																																											'unordered',
																																										bulletStyle:
																																											'disc'
																																									},
																																									children: [
																																										{
																																											type: LIST_NODE,
																																											subtype: LIST_LINE_NODE,
																																											content: {},
																																											children: [
																																												{
																																													text:
																																														'mockList',
																																													b: true
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

		wrapLevel([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).not.toHaveBeenCalled()
	})

	test('wrapLevel calls Transforms.wrapNodes on an ordered List', () => {
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

		wrapLevel([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})

	test('wrapLevel calls Transforms.wrapNodes on an unordered List', () => {
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

		wrapLevel([editor.children[0], [0]], editor, event)

		expect(event.preventDefault).toHaveBeenCalled()
		expect(Transforms.wrapNodes).toHaveBeenCalled()
	})
})

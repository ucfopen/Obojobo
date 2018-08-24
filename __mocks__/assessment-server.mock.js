// to generate this, start a fresh attempt on the test object
// grab the api results from the attempt start and paste here
const getAttemptStartServerResponse = () => {
	return {
		status: 'ok',
		value: {
			assessmentId: 'my-assessment',
			attemptId: '3af99802-2450-42e1-bddf-0649bb4007fe',
			endTime: null,
			result: null,
			startTime: '2018-05-11T19:36:01.873Z',
			state: {
				data: {},
				qb: {
					children: [
						{
							children: [
								{
									children: [
										{
											children: [],
											content: {
												headingLevel: 1,
												textGroup: [
													{
														data: null,
														text: {
															styleList: [],
															value: 'What is 2+2?'
														}
													}
												]
											},
											id: '9904761a-5643-436a-a8d1-f26ce25ce4d6',
											type: 'ObojoboDraft.Chunks.Heading'
										},
										{
											children: [
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '4'
																				}
																			}
																		]
																	},
																	id: '763d3bcc-dbc9-4533-a65e-a12003b493ec',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: 'dc5cdd0b-877c-450f-ae51-d45e6da991b5',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: 'a28768bf-0ce8-49a0-93f1-a9fef365a6e3',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: 'c57769e1-97af-4cb1-93d4-eb9b42f8f09b',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: '740b1cf5-290a-4cd7-8fa0-02dcab93d5fc',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												},
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '2'
																				}
																			}
																		]
																	},
																	id: '093139e1-6f9f-4cb8-b7e7-750e9ddd4d82',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '87f1faca-5ef2-4663-8dbb-bb7dda97d19b',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: '8b944ae0-51e5-4a29-ab78-08739823d281',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '3e4ad6ab-67dc-43ad-97c1-9b3c0eb4f4cb',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: 'c8d3810b-5d00-4221-96da-fb84aa617b9f',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												}
											],
											content: {
												responseType: 'pick-one',
												shuffle: true
											},
											id: '7bf44915-4ba7-4ffb-bf3c-952d6345f4f3',
											type: 'ObojoboDraft.Chunks.MCAssessment'
										}
									],
									content: {
										mode: 'assessment',
										solution: {
											children: [
												{
													children: [],
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	styleList: [],
																	value: 'Add additional information here'
																}
															}
														]
													},
													id: '9d878aca-04ea-41a4-877b-f520377f3dfc',
													type: 'ObojoboDraft.Chunks.Text'
												}
											],
											content: {},
											id: '80e45375-b64e-4d56-899a-723057808900',
											type: 'ObojoboDraft.Pages.Page'
										}
									},
									id: 'ab63e735-9a4f-45e9-b775-5bb48c8d761b',
									type: 'ObojoboDraft.Chunks.Question'
								},
								{
									children: [
										{
											children: [],
											content: {
												headingLevel: 1,
												textGroup: [
													{
														data: null,
														text: {
															styleList: [],
															value: 'What is 3-0?'
														}
													}
												]
											},
											id: '52b09eca-7dad-4121-9a10-5d820adebdae',
											type: 'ObojoboDraft.Chunks.Heading'
										},
										{
											children: [
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '3'
																				}
																			}
																		]
																	},
																	id: '94273da6-c6dc-45ad-87e7-f8fc558c10e5',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '02df9305-809e-4e55-baf1-2398c33c3247',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: '8371885d-a5bc-4954-b15e-09d2fdd76a0e',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '7a77df07-8877-4c4b-acb4-5025a4d01f44',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: '32ee1288-97f5-46f3-97a7-380971b13cde',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												},
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '0'
																				}
																			}
																		]
																	},
																	id: '59503c01-df78-4ac4-857f-f68bab8462dc',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '44780a6b-b062-464d-a70f-1f0fe30348aa',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: '87cfa205-21fa-4141-9adf-8d2726a35f20',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '44788516-693e-432f-a277-81f26e8b886f',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: 'be002526-ece4-497d-aabc-71b6dd88dbc8',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												}
											],
											content: {
												responseType: 'pick-one',
												shuffle: true
											},
											id: 'c4a13d51-187d-4fb4-9b01-454dc93b6d2f',
											type: 'ObojoboDraft.Chunks.MCAssessment'
										}
									],
									content: {
										mode: 'assessment',
										solution: {
											children: [
												{
													children: [],
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	styleList: [],
																	value: 'Add additional information here'
																}
															}
														]
													},
													id: '47ecafd6-1e30-41f5-b329-cfcfdf3eaa4a',
													type: 'ObojoboDraft.Chunks.Text'
												}
											],
											content: {},
											id: 'c5dd1700-e14e-4d88-838e-10de82e0be38',
											type: 'ObojoboDraft.Pages.Page'
										}
									},
									id: '48a4d6be-1544-447b-a774-c5ded24637a3',
									type: 'ObojoboDraft.Chunks.Question'
								},
								{
									children: [
										{
											children: [],
											content: {
												headingLevel: 1,
												textGroup: [
													{
														data: null,
														text: {
															styleList: [],
															value: 'What is 9-4?'
														}
													}
												]
											},
											id: '4e79324c-bfea-4cf5-89f9-ba518eb1f1be',
											type: 'ObojoboDraft.Chunks.Heading'
										},
										{
											children: [
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '5'
																				}
																			}
																		]
																	},
																	id: '2aa80260-456e-42d8-8eb3-0d87ceb8e112',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '39458e63-9d63-4d40-889a-ce384d80c527',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: 'bffc8e6a-1346-4cf5-a7a9-81a35083f320',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '05a9943b-d382-4c3e-8350-ebf9ad928f11',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: '7943af80-4dfd-429d-9d82-84edc57edeb4',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												},
												{
													children: [
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: '3'
																				}
																			}
																		]
																	},
																	id: '03b61949-0533-443c-a063-0f61628dc947',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: '6f6ff4f7-b8f6-4bb9-84ed-dd1da0d02a97',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
														},
														{
															children: [
																{
																	children: [],
																	content: {
																		textGroup: [
																			{
																				data: null,
																				text: {
																					styleList: [],
																					value: 'Optional answer feedback'
																				}
																			}
																		]
																	},
																	id: '9a5f2179-aa98-4aa8-a41b-b972b4da8888',
																	type: 'ObojoboDraft.Chunks.Text'
																}
															],
															content: {},
															id: 'a6f676b4-cc8c-4e6d-b5a8-883ab257bac8',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
														}
													],
													content: {
														score: 0
													},
													id: '347737d0-a404-493f-a0da-459ea4a17deb',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
												}
											],
											content: {
												responseType: 'pick-one',
												shuffle: true
											},
											id: '4b2843ab-cec0-433b-bf53-0312b07a2ecf',
											type: 'ObojoboDraft.Chunks.MCAssessment'
										}
									],
									content: {
										mode: 'assessment',
										solution: {
											children: [
												{
													children: [],
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	styleList: [],
																	value: 'Add additional information here'
																}
															}
														]
													},
													id: 'df30cc34-9433-485c-83c2-9d81867dd46e',
													type: 'ObojoboDraft.Chunks.Text'
												}
											],
											content: {},
											id: 'f236a500-c31c-431a-ade2-49319818cc29',
											type: 'ObojoboDraft.Pages.Page'
										}
									},
									id: '8a9cc72b-6da1-421a-a58c-fa684b53f863',
									type: 'ObojoboDraft.Chunks.Question'
								}
							],
							content: {
								select: 'random'
							},
							id: 'a02315ea-3f37-4208-86c8-1ddef043278d',
							type: 'ObojoboDraft.Chunks.QuestionBank'
						}
					],
					content: {
						choose: 1,
						select: 'sequential'
					},
					id: '612d5df4-849e-43fc-a204-c914d6b809ac',
					type: 'ObojoboDraft.Chunks.QuestionBank'
				},
				questions: [
					{
						children: [
							{
								children: [],
								content: {
									headingLevel: 1,
									textGroup: [
										{
											data: null,
											text: {
												styleList: [],
												value: 'What is 2+2?'
											}
										}
									]
								},
								id: '9904761a-5643-436a-a8d1-f26ce25ce4d6',
								type: 'ObojoboDraft.Chunks.Heading'
							},
							{
								children: [
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '4'
																	}
																}
															]
														},
														id: '763d3bcc-dbc9-4533-a65e-a12003b493ec',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: 'dc5cdd0b-877c-450f-ae51-d45e6da991b5',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: 'a28768bf-0ce8-49a0-93f1-a9fef365a6e3',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: 'c57769e1-97af-4cb1-93d4-eb9b42f8f09b',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: '740b1cf5-290a-4cd7-8fa0-02dcab93d5fc',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									},
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '2'
																	}
																}
															]
														},
														id: '093139e1-6f9f-4cb8-b7e7-750e9ddd4d82',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '87f1faca-5ef2-4663-8dbb-bb7dda97d19b',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: '8b944ae0-51e5-4a29-ab78-08739823d281',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '3e4ad6ab-67dc-43ad-97c1-9b3c0eb4f4cb',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: 'c8d3810b-5d00-4221-96da-fb84aa617b9f',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									}
								],
								content: {
									responseType: 'pick-one',
									shuffle: true
								},
								id: '7bf44915-4ba7-4ffb-bf3c-952d6345f4f3',
								type: 'ObojoboDraft.Chunks.MCAssessment'
							}
						],
						content: {
							mode: 'assessment',
							solution: {
								children: [
									{
										children: [],
										content: {
											textGroup: [
												{
													data: null,
													text: {
														styleList: [],
														value: 'Add additional information here'
													}
												}
											]
										},
										id: '9d878aca-04ea-41a4-877b-f520377f3dfc',
										type: 'ObojoboDraft.Chunks.Text'
									}
								],
								content: {},
								id: '80e45375-b64e-4d56-899a-723057808900',
								type: 'ObojoboDraft.Pages.Page'
							}
						},
						id: 'ab63e735-9a4f-45e9-b775-5bb48c8d761b',
						type: 'ObojoboDraft.Chunks.Question'
					},
					{
						children: [
							{
								children: [],
								content: {
									headingLevel: 1,
									textGroup: [
										{
											data: null,
											text: {
												styleList: [],
												value: 'What is 3-0?'
											}
										}
									]
								},
								id: '52b09eca-7dad-4121-9a10-5d820adebdae',
								type: 'ObojoboDraft.Chunks.Heading'
							},
							{
								children: [
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '3'
																	}
																}
															]
														},
														id: '94273da6-c6dc-45ad-87e7-f8fc558c10e5',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '02df9305-809e-4e55-baf1-2398c33c3247',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: '8371885d-a5bc-4954-b15e-09d2fdd76a0e',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '7a77df07-8877-4c4b-acb4-5025a4d01f44',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: '32ee1288-97f5-46f3-97a7-380971b13cde',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									},
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '0'
																	}
																}
															]
														},
														id: '59503c01-df78-4ac4-857f-f68bab8462dc',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '44780a6b-b062-464d-a70f-1f0fe30348aa',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: '87cfa205-21fa-4141-9adf-8d2726a35f20',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '44788516-693e-432f-a277-81f26e8b886f',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: 'be002526-ece4-497d-aabc-71b6dd88dbc8',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									}
								],
								content: {
									responseType: 'pick-one',
									shuffle: true
								},
								id: 'c4a13d51-187d-4fb4-9b01-454dc93b6d2f',
								type: 'ObojoboDraft.Chunks.MCAssessment'
							}
						],
						content: {
							mode: 'assessment',
							solution: {
								children: [
									{
										children: [],
										content: {
											textGroup: [
												{
													data: null,
													text: {
														styleList: [],
														value: 'Add additional information here'
													}
												}
											]
										},
										id: '47ecafd6-1e30-41f5-b329-cfcfdf3eaa4a',
										type: 'ObojoboDraft.Chunks.Text'
									}
								],
								content: {},
								id: 'c5dd1700-e14e-4d88-838e-10de82e0be38',
								type: 'ObojoboDraft.Pages.Page'
							}
						},
						id: '48a4d6be-1544-447b-a774-c5ded24637a3',
						type: 'ObojoboDraft.Chunks.Question'
					},
					{
						children: [
							{
								children: [],
								content: {
									headingLevel: 1,
									textGroup: [
										{
											data: null,
											text: {
												styleList: [],
												value: 'What is 9-4?'
											}
										}
									]
								},
								id: '4e79324c-bfea-4cf5-89f9-ba518eb1f1be',
								type: 'ObojoboDraft.Chunks.Heading'
							},
							{
								children: [
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '5'
																	}
																}
															]
														},
														id: '2aa80260-456e-42d8-8eb3-0d87ceb8e112',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '39458e63-9d63-4d40-889a-ce384d80c527',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: 'bffc8e6a-1346-4cf5-a7a9-81a35083f320',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '05a9943b-d382-4c3e-8350-ebf9ad928f11',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: '7943af80-4dfd-429d-9d82-84edc57edeb4',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									},
									{
										children: [
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: '3'
																	}
																}
															]
														},
														id: '03b61949-0533-443c-a063-0f61628dc947',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: '6f6ff4f7-b8f6-4bb9-84ed-dd1da0d02a97',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
											},
											{
												children: [
													{
														children: [],
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		styleList: [],
																		value: 'Optional answer feedback'
																	}
																}
															]
														},
														id: '9a5f2179-aa98-4aa8-a41b-b972b4da8888',
														type: 'ObojoboDraft.Chunks.Text'
													}
												],
												content: {},
												id: 'a6f676b4-cc8c-4e6d-b5a8-883ab257bac8',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback'
											}
										],
										content: {
											score: 0
										},
										id: '347737d0-a404-493f-a0da-459ea4a17deb',
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
									}
								],
								content: {
									responseType: 'pick-one',
									shuffle: true
								},
								id: '4b2843ab-cec0-433b-bf53-0312b07a2ecf',
								type: 'ObojoboDraft.Chunks.MCAssessment'
							}
						],
						content: {
							mode: 'assessment',
							solution: {
								children: [
									{
										children: [],
										content: {
											textGroup: [
												{
													data: null,
													text: {
														styleList: [],
														value: 'Add additional information here'
													}
												}
											]
										},
										id: 'df30cc34-9433-485c-83c2-9d81867dd46e',
										type: 'ObojoboDraft.Chunks.Text'
									}
								],
								content: {},
								id: 'f236a500-c31c-431a-ade2-49319818cc29',
								type: 'ObojoboDraft.Pages.Page'
							}
						},
						id: '8a9cc72b-6da1-421a-a58c-fa684b53f863',
						type: 'ObojoboDraft.Chunks.Question'
					}
				]
			}
		}
	}
}

// to generate this, start a fresh attempt on the test object
// select the first answer of each qestion and submit
// copyt the api results from the attempt end and paste here
const getAttemptEndServerResponse = () => {
	// res.success always renders { status: ..., value: {} }
	return {
		status: 'ok',
		value: {
			assessmentId: 'my-assessment',
			attempts: [
				{
					userId: '1',
					draftId: '55ea7680-0914-4d4c-8785-c65494b6b235',
					attemptId: 'cb309811-b40d-4b70-b4f0-7a48d7fbd2f3',
					assessmentScoreId: '4',
					attemptNumber: 1,
					assessmentId: 'my-assessment',
					startTime: '2018-05-11T19:40:55.697Z',
					finishTime: '2018-05-11T20:31:43.426Z',
					isFinished: true,
					state: {
						qb: {
							id: '612d5df4-849e-43fc-a204-c914d6b809ac',
							type: 'ObojoboDraft.Chunks.QuestionBank',
							content: {
								choose: 1,
								select: 'sequential'
							},
							children: [
								{
									id: 'a02315ea-3f37-4208-86c8-1ddef043278d',
									type: 'ObojoboDraft.Chunks.QuestionBank',
									content: {
										select: 'random'
									},
									children: [
										{
											id: 'ab63e735-9a4f-45e9-b775-5bb48c8d761b',
											type: 'ObojoboDraft.Chunks.Question',
											content: {
												solution: {
													id: '80e45375-b64e-4d56-899a-723057808900',
													type: 'ObojoboDraft.Pages.Page',
													content: {},
													children: [
														{
															id: '9d878aca-04ea-41a4-877b-f520377f3dfc',
															type: 'ObojoboDraft.Chunks.Text',
															content: {
																textGroup: [
																	{
																		data: null,
																		text: {
																			value: 'Add additional information here',
																			styleList: []
																		}
																	}
																]
															},
															children: []
														}
													]
												}
											},
											children: [
												{
													id: '9904761a-5643-436a-a8d1-f26ce25ce4d6',
													type: 'ObojoboDraft.Chunks.Heading',
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	value: 'What is 2+2?',
																	styleList: []
																}
															}
														],
														headingLevel: 1
													},
													children: []
												},
												{
													id: '7bf44915-4ba7-4ffb-bf3c-952d6345f4f3',
													type: 'ObojoboDraft.Chunks.MCAssessment',
													content: {
														shuffle: true,
														responseType: 'pick-one'
													},
													children: [
														{
															id: '740b1cf5-290a-4cd7-8fa0-02dcab93d5fc',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 100
															},
															children: [
																{
																	id: 'dc5cdd0b-877c-450f-ae51-d45e6da991b5',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '763d3bcc-dbc9-4533-a65e-a12003b493ec',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '4',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: 'c57769e1-97af-4cb1-93d4-eb9b42f8f09b',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: 'a28768bf-0ce8-49a0-93f1-a9fef365a6e3',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																}
															]
														},
														{
															id: 'c8d3810b-5d00-4221-96da-fb84aa617b9f',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 0
															},
															children: [
																{
																	id: '87f1faca-5ef2-4663-8dbb-bb7dda97d19b',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '093139e1-6f9f-4cb8-b7e7-750e9ddd4d82',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '2',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: '3e4ad6ab-67dc-43ad-97c1-9b3c0eb4f4cb',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: '8b944ae0-51e5-4a29-ab78-08739823d281',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																}
															]
														}
													]
												}
											]
										},
										{
											id: '48a4d6be-1544-447b-a774-c5ded24637a3',
											type: 'ObojoboDraft.Chunks.Question',
											content: {
												solution: {
													id: 'c5dd1700-e14e-4d88-838e-10de82e0be38',
													type: 'ObojoboDraft.Pages.Page',
													content: {},
													children: [
														{
															id: '47ecafd6-1e30-41f5-b329-cfcfdf3eaa4a',
															type: 'ObojoboDraft.Chunks.Text',
															content: {
																textGroup: [
																	{
																		data: null,
																		text: {
																			value: 'Add additional information here',
																			styleList: []
																		}
																	}
																]
															},
															children: []
														}
													]
												}
											},
											children: [
												{
													id: '52b09eca-7dad-4121-9a10-5d820adebdae',
													type: 'ObojoboDraft.Chunks.Heading',
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	value: 'What is 3-0?',
																	styleList: []
																}
															}
														],
														headingLevel: 1
													},
													children: []
												},
												{
													id: 'c4a13d51-187d-4fb4-9b01-454dc93b6d2f',
													type: 'ObojoboDraft.Chunks.MCAssessment',
													content: {
														shuffle: true,
														responseType: 'pick-one'
													},
													children: [
														{
															id: '32ee1288-97f5-46f3-97a7-380971b13cde',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 100
															},
															children: [
																{
																	id: '02df9305-809e-4e55-baf1-2398c33c3247',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '94273da6-c6dc-45ad-87e7-f8fc558c10e5',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '3',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: '7a77df07-8877-4c4b-acb4-5025a4d01f44',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: '8371885d-a5bc-4954-b15e-09d2fdd76a0e',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																}
															]
														},
														{
															id: 'be002526-ece4-497d-aabc-71b6dd88dbc8',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 0
															},
															children: [
																{
																	id: '44780a6b-b062-464d-a70f-1f0fe30348aa',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '59503c01-df78-4ac4-857f-f68bab8462dc',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '0',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: '44788516-693e-432f-a277-81f26e8b886f',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: '87cfa205-21fa-4141-9adf-8d2726a35f20',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																}
															]
														}
													]
												}
											]
										},
										{
											id: '8a9cc72b-6da1-421a-a58c-fa684b53f863',
											type: 'ObojoboDraft.Chunks.Question',
											content: {
												solution: {
													id: 'f236a500-c31c-431a-ade2-49319818cc29',
													type: 'ObojoboDraft.Pages.Page',
													content: {},
													children: [
														{
															id: 'df30cc34-9433-485c-83c2-9d81867dd46e',
															type: 'ObojoboDraft.Chunks.Text',
															content: {
																textGroup: [
																	{
																		data: null,
																		text: {
																			value: 'Add additional information here',
																			styleList: []
																		}
																	}
																]
															},
															children: []
														}
													]
												}
											},
											children: [
												{
													id: '4e79324c-bfea-4cf5-89f9-ba518eb1f1be',
													type: 'ObojoboDraft.Chunks.Heading',
													content: {
														textGroup: [
															{
																data: null,
																text: {
																	value: 'What is 9-4?',
																	styleList: []
																}
															}
														],
														headingLevel: 1
													},
													children: []
												},
												{
													id: '4b2843ab-cec0-433b-bf53-0312b07a2ecf',
													type: 'ObojoboDraft.Chunks.MCAssessment',
													content: {
														shuffle: true,
														responseType: 'pick-one'
													},
													children: [
														{
															id: '7943af80-4dfd-429d-9d82-84edc57edeb4',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 100
															},
															children: [
																{
																	id: '39458e63-9d63-4d40-889a-ce384d80c527',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '2aa80260-456e-42d8-8eb3-0d87ceb8e112',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '5',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: '05a9943b-d382-4c3e-8350-ebf9ad928f11',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: 'bffc8e6a-1346-4cf5-a7a9-81a35083f320',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																}
															]
														},
														{
															id: '347737d0-a404-493f-a0da-459ea4a17deb',
															type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
															content: {
																score: 0
															},
															children: [
																{
																	id: '6f6ff4f7-b8f6-4bb9-84ed-dd1da0d02a97',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
																	content: {},
																	children: [
																		{
																			id: '03b61949-0533-443c-a063-0f61628dc947',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: '3',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
																		}
																	]
																},
																{
																	id: 'a6f676b4-cc8c-4e6d-b5a8-883ab257bac8',
																	type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
																	content: {},
																	children: [
																		{
																			id: '9a5f2179-aa98-4aa8-a41b-b972b4da8888',
																			type: 'ObojoboDraft.Chunks.Text',
																			content: {
																				textGroup: [
																					{
																						data: null,
																						text: {
																							value: 'Optional answer feedback',
																							styleList: []
																						}
																					}
																				]
																			},
																			children: []
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
						},
						data: {},
						questions: [
							{
								id: 'ab63e735-9a4f-45e9-b775-5bb48c8d761b',
								type: 'ObojoboDraft.Chunks.Question',
								content: {
									solution: {
										id: '80e45375-b64e-4d56-899a-723057808900',
										type: 'ObojoboDraft.Pages.Page',
										content: {},
										children: [
											{
												id: '9d878aca-04ea-41a4-877b-f520377f3dfc',
												type: 'ObojoboDraft.Chunks.Text',
												content: {
													textGroup: [
														{
															data: null,
															text: {
																value: 'Add additional information here',
																styleList: []
															}
														}
													]
												},
												children: []
											}
										]
									}
								},
								children: [
									{
										id: '9904761a-5643-436a-a8d1-f26ce25ce4d6',
										type: 'ObojoboDraft.Chunks.Heading',
										content: {
											textGroup: [
												{
													data: null,
													text: {
														value: 'What is 2+2?',
														styleList: []
													}
												}
											],
											headingLevel: 1
										},
										children: []
									},
									{
										id: '7bf44915-4ba7-4ffb-bf3c-952d6345f4f3',
										type: 'ObojoboDraft.Chunks.MCAssessment',
										content: {
											shuffle: true,
											responseType: 'pick-one'
										},
										children: [
											{
												id: '740b1cf5-290a-4cd7-8fa0-02dcab93d5fc',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 100
												},
												children: [
													{
														id: 'dc5cdd0b-877c-450f-ae51-d45e6da991b5',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '763d3bcc-dbc9-4533-a65e-a12003b493ec',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '4',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: 'c57769e1-97af-4cb1-93d4-eb9b42f8f09b',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: 'a28768bf-0ce8-49a0-93f1-a9fef365a6e3',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													}
												]
											},
											{
												id: 'c8d3810b-5d00-4221-96da-fb84aa617b9f',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: '87f1faca-5ef2-4663-8dbb-bb7dda97d19b',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '093139e1-6f9f-4cb8-b7e7-750e9ddd4d82',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '2',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: '3e4ad6ab-67dc-43ad-97c1-9b3c0eb4f4cb',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: '8b944ae0-51e5-4a29-ab78-08739823d281',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								id: '48a4d6be-1544-447b-a774-c5ded24637a3',
								type: 'ObojoboDraft.Chunks.Question',
								content: {
									solution: {
										id: 'c5dd1700-e14e-4d88-838e-10de82e0be38',
										type: 'ObojoboDraft.Pages.Page',
										content: {},
										children: [
											{
												id: '47ecafd6-1e30-41f5-b329-cfcfdf3eaa4a',
												type: 'ObojoboDraft.Chunks.Text',
												content: {
													textGroup: [
														{
															data: null,
															text: {
																value: 'Add additional information here',
																styleList: []
															}
														}
													]
												},
												children: []
											}
										]
									}
								},
								children: [
									{
										id: '52b09eca-7dad-4121-9a10-5d820adebdae',
										type: 'ObojoboDraft.Chunks.Heading',
										content: {
											textGroup: [
												{
													data: null,
													text: {
														value: 'What is 3-0?',
														styleList: []
													}
												}
											],
											headingLevel: 1
										},
										children: []
									},
									{
										id: 'c4a13d51-187d-4fb4-9b01-454dc93b6d2f',
										type: 'ObojoboDraft.Chunks.MCAssessment',
										content: {
											shuffle: true,
											responseType: 'pick-one'
										},
										children: [
											{
												id: '32ee1288-97f5-46f3-97a7-380971b13cde',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 100
												},
												children: [
													{
														id: '02df9305-809e-4e55-baf1-2398c33c3247',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '94273da6-c6dc-45ad-87e7-f8fc558c10e5',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '3',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: '7a77df07-8877-4c4b-acb4-5025a4d01f44',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: '8371885d-a5bc-4954-b15e-09d2fdd76a0e',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													}
												]
											},
											{
												id: 'be002526-ece4-497d-aabc-71b6dd88dbc8',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: '44780a6b-b062-464d-a70f-1f0fe30348aa',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '59503c01-df78-4ac4-857f-f68bab8462dc',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '0',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: '44788516-693e-432f-a277-81f26e8b886f',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: '87cfa205-21fa-4141-9adf-8d2726a35f20',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													}
												]
											}
										]
									}
								]
							},
							{
								id: '8a9cc72b-6da1-421a-a58c-fa684b53f863',
								type: 'ObojoboDraft.Chunks.Question',
								content: {
									solution: {
										id: 'f236a500-c31c-431a-ade2-49319818cc29',
										type: 'ObojoboDraft.Pages.Page',
										content: {},
										children: [
											{
												id: 'df30cc34-9433-485c-83c2-9d81867dd46e',
												type: 'ObojoboDraft.Chunks.Text',
												content: {
													textGroup: [
														{
															data: null,
															text: {
																value: 'Add additional information here',
																styleList: []
															}
														}
													]
												},
												children: []
											}
										]
									}
								},
								children: [
									{
										id: '4e79324c-bfea-4cf5-89f9-ba518eb1f1be',
										type: 'ObojoboDraft.Chunks.Heading',
										content: {
											textGroup: [
												{
													data: null,
													text: {
														value: 'What is 9-4?',
														styleList: []
													}
												}
											],
											headingLevel: 1
										},
										children: []
									},
									{
										id: '4b2843ab-cec0-433b-bf53-0312b07a2ecf',
										type: 'ObojoboDraft.Chunks.MCAssessment',
										content: {
											shuffle: true,
											responseType: 'pick-one'
										},
										children: [
											{
												id: '7943af80-4dfd-429d-9d82-84edc57edeb4',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 100
												},
												children: [
													{
														id: '39458e63-9d63-4d40-889a-ce384d80c527',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '2aa80260-456e-42d8-8eb3-0d87ceb8e112',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '5',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: '05a9943b-d382-4c3e-8350-ebf9ad928f11',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: 'bffc8e6a-1346-4cf5-a7a9-81a35083f320',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													}
												]
											},
											{
												id: '347737d0-a404-493f-a0da-459ea4a17deb',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: '6f6ff4f7-b8f6-4bb9-84ed-dd1da0d02a97',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {},
														children: [
															{
																id: '03b61949-0533-443c-a063-0f61628dc947',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: '3',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
															}
														]
													},
													{
														id: 'a6f676b4-cc8c-4e6d-b5a8-883ab257bac8',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {},
														children: [
															{
																id: '9a5f2179-aa98-4aa8-a41b-b972b4da8888',
																type: 'ObojoboDraft.Chunks.Text',
																content: {
																	textGroup: [
																		{
																			data: null,
																			text: {
																				value: 'Optional answer feedback',
																				styleList: []
																			}
																		}
																	]
																},
																children: []
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
					},
					questionScores: [
						{
							id: 'ab63e735-9a4f-45e9-b775-5bb48c8d761b',
							score: 100
						},
						{
							id: '48a4d6be-1544-447b-a774-c5ded24637a3',
							score: 100
						},
						{
							id: '8a9cc72b-6da1-421a-a58c-fa684b53f863',
							score: 100
						}
					],
					responses: {
						'ab63e735-9a4f-45e9-b775-5bb48c8d761b': {
							ids: ['740b1cf5-290a-4cd7-8fa0-02dcab93d5fc']
						},
						'48a4d6be-1544-447b-a774-c5ded24637a3': {
							ids: ['32ee1288-97f5-46f3-97a7-380971b13cde']
						},
						'8a9cc72b-6da1-421a-a58c-fa684b53f863': {
							ids: ['7943af80-4dfd-429d-9d82-84edc57edeb4']
						}
					},
					attemptScore: 100,
					assessmentScore: 100,
					assessmentScoreDetails: {
						status: 'passed',
						rewardTotal: 0,
						attemptScore: 100,
						rewardedMods: [],
						attemptNumber: 1,
						assessmentScore: 100,
						assessmentModdedScore: 100
					}
				}
			],
			ltiState: {
				scoreSent: null,
				sentDate: '2018-05-11T20:31:43.461Z',
				status: 'not_attempted_preview_mode',
				gradebookStatus: 'ok_preview_mode',
				statusDetails: null
			}
		}
	}
}

export { getAttemptStartServerResponse, getAttemptEndServerResponse }

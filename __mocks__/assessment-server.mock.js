let getAttemptStartServerResponse = () => {
	return {
		status: 'ok',
		value: {
			assessmentId: 'assessment',
			attemptId: '00000000-0000-0000-0000-000000000000',
			endTime: null,
			startTime: '1970-01-01T00:00:00.000Z',
			state: {
				data: {},
				qb: {
					id: 'c8587164-f7a2-4927-9548-58b8a94b86c9',
					type: 'ObojoboDraft.Chunks.QuestionBank',
					content: {
						choose: 1,
						select: 'sequential'
					},
					children: [
						{
							id: 'qb1',
							type: 'ObojoboDraft.Chunks.QuestionBank',
							content: {
								choose: 1,
								select: 'sequential'
							},
							children: [
								{
									id: 'qb1-q1',
									type: 'ObojoboDraft.Chunks.Question',
									content: {},
									children: [
										{
											id: '8dffa3d6-9185-46a0-9b0c-bc2393532ccf',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value:
																"Question Bank 1 Question 1 - This is the first question you'll see",
															styleList: []
														},
														data: null
													}
												]
											},
											children: []
										},
										{
											id: 'qb1-q1-mca',
											type: 'ObojoboDraft.Chunks.MCInteraction',
											content: {
												responseType: 'pick-one'
											},
											children: [
												{
													id: 'qb1-q1-mca-mc1',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 100
													},
													children: [
														{
															id: 'qb1-q1-mca-mc1-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: '9bb1c551-48be-4406-9cdb-fa21044168ca',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Correct',
																					styleList: []
																				},
																				data: null
																			}
																		]
																	},
																	children: []
																}
															]
														},
														{
															id: 'qb1-q1-mca-mc1-fb',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
															content: {},
															children: [
																{
																	id: 'qb1-q1-mca-mc1-fb-t',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Correct',
																					styleList: []
																				},
																				data: null
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
													id: 'qb1-q1-mca-mc2',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 0
													},
													children: [
														{
															id: 'qb1-q1-mca-mc2-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: '6f271e7e-15ad-4467-9ea6-66ebf625c4fa',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Incorrect',
																					styleList: []
																				},
																				data: null
																			}
																		]
																	},
																	children: []
																}
															]
														},
														{
															id: 'qb1-q1-mca-mc2-fb',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
															content: {},
															children: [
																{
																	id: 'qb1-q1-mca-mc2-fb-t',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Incorrect',
																					styleList: []
																				},
																				data: null
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
									id: 'qb1-q2',
									type: 'ObojoboDraft.Chunks.Question',
									content: {},
									children: [
										{
											id: '507d21a8-7ae6-4978-9343-6de0923bb0bc',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value:
																"Question Bank 1 Question 2 - This is the fourth question you'll see",
															styleList: []
														},
														data: null
													}
												]
											},
											children: []
										},
										{
											id: 'qb1-q2-mca',
											type: 'ObojoboDraft.Chunks.MCInteraction',
											content: {
												responseType: 'pick-one'
											},
											children: [
												{
													id: 'qb1-q2-mca-mc1',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 100
													},
													children: [
														{
															id: 'qb1-q2-mca-mc1-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: 'a4f51a79-fb8c-4cff-86fa-3da3423cfe77',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Correct',
																					styleList: []
																				},
																				data: null
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
													id: 'qb1-q2-mca-mc2',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 0
													},
													children: [
														{
															id: 'qb1-q2-mca-mc2-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: 'c5821823-9a39-4f78-ae20-71de2baad1ed',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Incorrect',
																					styleList: []
																				},
																				data: null
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
						{
							id: 'qb2',
							type: 'ObojoboDraft.Chunks.QuestionBank',
							content: {},
							children: [
								{
									id: 'qb2.q1',
									type: 'ObojoboDraft.Chunks.Question',
									content: {},
									children: [
										{
											id: 'ef787e6c-a7cf-40a5-9b34-4507b955326f',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value:
																"Question Bank 2 Question 1 - This is the second question you'll see",
															styleList: []
														},
														data: null
													}
												]
											},
											children: []
										},
										{
											id: 'qb2.q1-mca',
											type: 'ObojoboDraft.Chunks.MCInteraction',
											content: {
												responseType: 'pick-one'
											},
											children: [
												{
													id: 'qb2.q1-mca-mc1',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 100
													},
													children: [
														{
															id: 'qb2.q1-mca-mc1-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: '7207dfd6-a171-4fe9-8a1a-b2614fdb9873',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Correct',
																					styleList: []
																				},
																				data: null
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
													id: 'qb2.q1-mca-mc2',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 0
													},
													children: [
														{
															id: 'qb2.q1-mca-mc2-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: 'e3829d20-f884-4e5a-96d7-7b2eac59ee4d',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Incorrect',
																					styleList: []
																				},
																				data: null
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
									id: 'qb2.q2',
									type: 'ObojoboDraft.Chunks.Question',
									content: {},
									children: [
										{
											id: '2bda57b5-254e-4465-8572-23d5250cc715',
											type: 'ObojoboDraft.Chunks.Text',
											content: {
												textGroup: [
													{
														text: {
															value:
																"Question Bank 2 Question 2 - This is the third question you'll see",
															styleList: []
														},
														data: null
													}
												]
											},
											children: []
										},
										{
											id: 'qb2.q2-mca',
											type: 'ObojoboDraft.Chunks.MCInteraction',
											content: {
												responseType: 'pick-one'
											},
											children: [
												{
													id: 'qb2.q2-mca-mc1',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 100
													},
													children: [
														{
															id: 'qb2.q2-mca-mc1-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: '12d8347b-95e1-4324-9d32-24c68d318ecb',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Correct',
																					styleList: []
																				},
																				data: null
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
													id: 'qb2.q2-mca-mc2',
													type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
													content: {
														score: 0
													},
													children: [
														{
															id: 'qb2.q2-mca-mc2-ans',
															type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
															content: {},
															children: [
																{
																	id: '02ed7f55-8181-4431-9d35-96dbb778221a',
																	type: 'ObojoboDraft.Chunks.Text',
																	content: {
																		textGroup: [
																			{
																				text: {
																					value: 'Incorrect',
																					styleList: []
																				},
																				data: null
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
				questions: [
					{
						id: 'qb1-q1',
						type: 'ObojoboDraft.Chunks.Question',
						content: {},
						children: [
							{
								id: '8dffa3d6-9185-46a0-9b0c-bc2393532ccf',
								type: 'ObojoboDraft.Chunks.Text',
								content: {
									textGroup: [
										{
											text: {
												value: "Question Bank 1 Question 1 - This is the first question you'll see",
												styleList: []
											},
											data: null
										}
									]
								},
								children: []
							},
							{
								id: 'qb1-q1-mca',
								type: 'ObojoboDraft.Chunks.MCInteraction',
								content: {
									responseType: 'pick-one'
								},
								children: [
									{
										id: 'qb1-q1-mca-mc1',
										type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
										content: {
											score: 100
										},
										children: [
											{
												id: 'qb1-q1-mca-mc1-ans',
												type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
												content: {},
												children: [
													{
														id: '9bb1c551-48be-4406-9cdb-fa21044168ca',
														type: 'ObojoboDraft.Chunks.Text',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Correct',
																		styleList: []
																	},
																	data: null
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
										id: 'qb1-q1-mca-mc2',
										type: 'ObojoboDraft.Chunks.MCInteraction.MCChoice',
										content: {
											score: 0
										},
										children: [
											{
												id: 'qb1-q1-mca-mc2-ans',
												type: 'ObojoboDraft.Chunks.MCInteraction.MCAnswer',
												content: {},
												children: [
													{
														id: '6f271e7e-15ad-4467-9ea6-66ebf625c4fa',
														type: 'ObojoboDraft.Chunks.Text',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Incorrect',
																		styleList: []
																	},
																	data: null
																}
															]
														},
														children: []
													}
												]
											},
											{
												id: 'qb1-q1-mca-mc2-fb',
												type: 'ObojoboDraft.Chunks.MCInteraction.MCFeedback',
												content: {},
												children: [
													{
														id: 'qb1-q1-mca-mc2-fb-t',
														type: 'ObojoboDraft.Chunks.Text',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Incorrect',
																		styleList: []
																	},
																	data: null
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
		}
	}
}

let getAttemptEndServerResponse = questionScore => {
	let startResp = getAttemptStartServerResponse()

	return {
		status: 'ok',
		value: {
			assessmentId: 'assessment',
			attemptId: '00000000-0000-0000-0000-000000000000',
			startTime: '1970-01-01T00:00:00.000Z',
			endTime: '1970-01-01T00:00:10.000Z',
			ltiOutcomes: {
				sent: false
			},
			result: {
				attemptScore: questionScore,
				scores: [{ id: 'qb1-q1', score: questionScore }]
			},
			state: startResp.state
		}
	}
}

export { getAttemptStartServerResponse, getAttemptEndServerResponse }

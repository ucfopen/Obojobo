let getAttemptStartServerResponse = () => {
	return (
		{
			status: 'ok',
			value: {
				assessmentId: 'assessment',
				attemptId: '00000000-0000-0000-0000-000000000000',
				endTime: null,
				startTime: '1970-01-01T00:00:00.000Z',
				state: {
					data: {},
					qb: {
						id: 'qb',
						type: 'ObojoboDraft.Chunks.QuestionBank',
						children: [
							{
								id: 'question1',
								type: 'ObojoboDraft.Chunks.Question',
								children: [
									{
										id: 'question1-text1',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Question Text'
													}
												}
											]
										}
									},
									{
										id: 'question1-mcassessment1',
										type: 'ObojoboDraft.Chunks.MCAssessment',
										children: [
											{
												id: 'question1-mcassessment1-choice1',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: 'question1-mcassessment1-choice1-answer1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Answer Text'
																	}
																}
															]
														}
													},
													{
														id: 'question1-mcassessment1-choice1-feedback1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Feedback Text'
																	}
																}
															]
														}
													}
												]
											},
											{
												id: 'question1-mcassessment1-choice2',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: 'question1-mcassessment1-choice2-answer1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Answer Text'
																	}
																}
															]
														}
													},
													{
														id: 'question1-mcassessment1-choice2-feedback1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Feedback Text'
																	}
																}
															]
														}
													}
												]
											}
										]
									}
								]
							},
							{
								id: 'question2',
								type: 'ObojoboDraft.Chunks.Question',
								children: [
									{
										id: 'question2-text1',
										type: 'ObojoboDraft.Chunks.Text',
										content: {
											textGroup: [
												{
													text: {
														value: 'Question Text'
													}
												}
											]
										}
									},
									{
										id: 'question2-mcassessment1',
										type: 'ObojoboDraft.Chunks.MCAssessment',
										children: [
											{
												id: 'question2-mcassessment1-choice1',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: 'question2-mcassessment1-choice1-answer1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Answer Text'
																	}
																}
															]
														}
													},
													{
														id: 'question2-mcassessment1-choice1-feedback1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Feedback Text'
																	}
																}
															]
														}
													}
												]
											},
											{
												id: 'question2-mcassessment1-choice2',
												type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
												content: {
													score: 0
												},
												children: [
													{
														id: 'question2-mcassessment1-choice2-answer1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Answer Text'
																	}
																}
															]
														}
													},
													{
														id: 'question2-mcassessment1-choice2-feedback1',
														type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
														content: {
															textGroup: [
																{
																	text: {
																		value: 'Feedback Text'
																	}
																}
															]
														}
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
							id: 'question1',
							type: 'ObojoboDraft.Chunks.Question',
							children: [
								{
									id: 'question1-text1',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												text: {
													value: 'Question Text'
												}
											}
										]
									}
								},
								{
									id: 'question1-mcassessment1',
									type: 'ObojoboDraft.Chunks.MCAssessment',
									children: [
										{
											id: 'question1-mcassessment1-choice1',
											type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
											content: {
												score: 0
											},
											children: [
												{
													id: 'question1-mcassessment1-choice1-answer1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Answer Text'
																}
															}
														]
													}
												},
												{
													id: 'question1-mcassessment1-choice1-feedback1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Feedback Text'
																}
															}
														]
													}
												}
											]
										},
										{
											id: 'question1-mcassessment1-choice2',
											type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
											content: {
												score: 0
											},
											children: [
												{
													id: 'question1-mcassessment1-choice2-answer1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Answer Text'
																}
															}
														]
													}
												},
												{
													id: 'question1-mcassessment1-choice2-feedback1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Feedback Text'
																}
															}
														]
													}
												}
											]
										}
									]
								}
							]
						},
						{
							id: 'question2',
							type: 'ObojoboDraft.Chunks.Question',
							children: [
								{
									id: 'question2-text1',
									type: 'ObojoboDraft.Chunks.Text',
									content: {
										textGroup: [
											{
												text: {
													value: 'Question Text'
												}
											}
										]
									}
								},
								{
									id: 'question2-mcassessment1',
									type: 'ObojoboDraft.Chunks.MCAssessment',
									children: [
										{
											id: 'question2-mcassessment1-choice1',
											type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
											content: {
												score: 0
											},
											children: [
												{
													id: 'question2-mcassessment1-choice1-answer1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Answer Text'
																}
															}
														]
													}
												},
												{
													id: 'question2-mcassessment1-choice1-feedback1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Feedback Text'
																}
															}
														]
													}
												}
											]
										},
										{
											id: 'question2-mcassessment1-choice2',
											type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
											content: {
												score: 0
											},
											children: [
												{
													id: 'question2-mcassessment1-choice2-answer1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Answer Text'
																}
															}
														]
													}
												},
												{
													id: 'question2-mcassessment1-choice2-feedback1',
													type: 'ObojoboDraft.Chunks.MCAssessment.MCFeedback',
													content: {
														textGroup: [
															{
																text: {
																	value: 'Feedback Text'
																}
															}
														]
													}
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
	)
}

let getAttemptEndServerResponse = (questionScore1, questionScore2) => {
	let startResp = getAttemptStartServerResponse();

	return (
		{
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
					attemptScore: (questionScore1 + questionScore2) / 2,
					scores: [
						{ id:"question1", score:questionScore1 },
						{ id:"question2", score:questionScore2 }
					]
				},
				state: startResp.state
			}
		}
	)
}

export { getAttemptStartServerResponse, getAttemptEndServerResponse }
import generateId from '../generate-ids'

const generateAssessment = () => {
	const assessmentId = generateId()
	return {
		id: assessmentId,
		type: 'ObojoboDraft.Sections.Assessment',
		content: {
			review: 'never',
			attempts: 'unlimited',
			scoreActions: [
				{
					'for': '[0,100]',
					page: {
						id: generateId(),
						type: 'ObojoboDraft.Pages.Page',
						content: {},
						children: [
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.Heading',
								content: {
									textGroup: [
										{
											data: {
												align: 'center'
											},
											text: {
												value: 'How did you do?',
												styleList: []
											}
										}
									],
									headingLevel: 1
								},
								children: []
							},
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.Text',
								content: {
									textGroup: [
										{
											data: {
												align: 'center'
											},
											text: {
												value: 'You have {{assessment:attemptsRemaining}} attempts remaining.',
												styleList: []
											}
										}
									]
								},
								children: []
							},
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.ActionButton',
								content: {
									align: 'center',
									triggers: [
										{
											type: 'onClick',
											actions: [
												{
													type: 'assessment:startAttempt',
													value: {
														id: assessmentId
													}
												}
											]
										}
									],
									textGroup: [
										{
											data: null,
											text: {
												value: 'Retry Assessment',
												styleList: []
											}
										}
									]
								},
								children: []
							}
						]
					}
				}
			]
		},
		children: [
			{
				id: generateId(),
				type: 'ObojoboDraft.Pages.Page',
				content: {},
				children: [
					{
						id: generateId(),
						type: 'ObojoboDraft.Chunks.Heading',
						content: {
							textGroup: [
								{
									data: {
										align: 'center'
									},
									text: {
										value: 'Assessment Intro Title',
										styleList: []
									}
								}
							],
							headingLevel: 1
						},
						children: []
					},
					{
						id: generateId(),
						type: 'ObojoboDraft.Chunks.Text',
						content: {
							textGroup: [
								{
									data: {
										align: 'center'
									},
									text: {
										value: 'Some overview before starting the Assessment.',
										styleList: []
									}
								}
							]
						},
						children: []
					},
					{
						id: generateId(),
						type: 'ObojoboDraft.Chunks.Text',
						content: {
							textGroup: [
								{
									data: {
										align: 'center'
									},
									text: {
										value: 'You have {{assessment:attemptsRemaining}} attempts remaining.',
										styleList: []
									}
								}
							]
						},
						children: []
					},
					{
						id: generateId(),
						type: 'ObojoboDraft.Chunks.ActionButton',
						content: {
							triggers: [
								{
									type: 'onClick',
									actions: [
										{
											type: 'assessment:startAttempt',
											value: {
												id: assessmentId
											}
										}
									]
								}
							],
							textGroup: [
								{
									data: null,
									text: {
										value: 'Start Assessment',
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
				id: generateId(),
				type: 'ObojoboDraft.Chunks.QuestionBank',
				content: {
					choose: null,
					select: 'sequential'
				},
				children: [
					{
						id: generateId(),
						type: 'ObojoboDraft.Chunks.Question',
						content: {},
						children: [
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.Heading',
								content: {
									textGroup: [
										{
											data: null,
											text: {
												value: 'Your Question Here',
												styleList: []
											}
										}
									],
									headingLevel: 1
								},
								children: []
							},
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.Text',
								content: {
									textGroup: [
										{
											data: null,
											text: {
												value: 'More question text here.',
												styleList: []
											}
										}
									]
								},
								children: []
							},
							{
								id: generateId(),
								type: 'ObojoboDraft.Chunks.MCAssessment',
								content: {
									shuffle: false,
									responseType: 'pick-one'
								},
								children: [
									{
										id: generateId(),
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
										content: {
											score: 100
										},
										children: [
											{
												id: generateId(),
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
												content: {},
												children: [
													{
														id: generateId(),
														type: 'ObojoboDraft.Chunks.Text',
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		value: 'Correct answer',
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
										id: generateId(),
										type: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
										content: {
											score: 0
										},
										children: [
											{
												id: generateId(),
												type: 'ObojoboDraft.Chunks.MCAssessment.MCAnswer',
												content: {},
												children: [
													{
														id: generateId(),
														type: 'ObojoboDraft.Chunks.Text',
														content: {
															textGroup: [
																{
																	data: null,
																	text: {
																		value: 'Incorrect answer',
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
	}
}

export default generateAssessment

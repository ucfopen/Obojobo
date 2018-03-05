let express = require('express')
let app = express()
let oboEvents = oboRequire('obo_events')
let DraftModel = oboRequire('models/draft')
let db = oboRequire('db')
let Assessment = require('./assessment')
let lti = oboRequire('lti')
let insertEvent = oboRequire('insert_event')
let logger = oboRequire('logger')
let createCaliperEvent = oboRequire('routes/api/events/create_caliper_event') //@TODO
let endAttempt = require('./attempt-end').endAttempt

let logAndRespondToUnexpected = (res, originalError, errorForResponse) => {
	logger.error('logAndRespondToUnexpected', originalError)
	res.unexpected(errorForResponse)
}

app.get('/api/lti/state/draft/:draftId', (req, res, next) => {
	let currentUser

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			return lti.getLTIStatesByAssessmentIdForUserAndDraft(currentUser.id, req.params.draftId)
		})
		.then(result => {
			res.success(result)
		})
})

app.post('/api/lti/sendAssessmentScore', (req, res, next) => {
	logger.info('API sendAssessmentScore', req.body)

	let currentUser
	let ltiScoreResult
	let assessmentScoreId
	let draftId = req.body.draftId
	let assessmentId = req.body.assessmentId

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user

			logger.info(
				`API sendAssessmentScore with userId="${user.id}", draftId="${draftId}", assessmentId="${assessmentId}"`
			)

			return lti.sendHighestAssessmentScore(currentUser.id, draftId, assessmentId)
		})
		.then(result => {
			ltiScoreResult = result

			res.success({
				score: ltiScoreResult.scoreSent,
				status: ltiScoreResult.status,
				statusDetails: ltiScoreResult.statusDetails,
				dbStatus: ltiScoreResult.dbStatus,
				gradebookStatus: ltiScoreResult.gradebookStatus
			})
		})
		.catch(e => {
			logAndRespondToUnexpected(res, e, new Error('Unexpected error starting a new attempt'))
		})
})

app.post('/api/assessments/attempt/start', (req, res, next) => {
	let currentUser
	let draftId = req.body.draftId
	let draftTree
	let attemptState
	let numAttempts
	let isPreviewing
	let attemptHistory
	let assessmentQBTree

	req
		.requireCurrentUser()
		.then(user => {
			currentUser = user
			isPreviewing = currentUser.canViewEditor

			return DraftModel.fetchById(draftId)
		})
		.then(draft => {
			draftTree = draft

			return Assessment.getCompletedAssessmentAttemptHistory(
				currentUser.id,
				req.body.draftId,
				req.body.assessmentId,
				true
			)
		})
		.then(result => {
			attemptHistory = result
			return Assessment.getNumberAttemptsTaken(
				currentUser.id,
				req.body.draftId,
				req.body.assessmentId
			)
		})
		.then(numAttemptsResult => {
			numAttempts = numAttemptsResult

			var assessment = draftTree.getChildNodeById(req.body.assessmentId)

			if (
				!isPreviewing &&
				assessment.node.content.attempts &&
				numAttempts >= assessment.node.content.attempts
			) {
				throw new Error('Attempt limit reached')
			}

			// 1. create a tree structure from the assessment question bank
			// 2. create another tree structure from the attempt history
			// 3. use the attempt history and node settings to trim the tree,
			//  leaving only the nodes to send to the client
			// 4. flatten the tree to only questions

			let getBankOptions = questionBankNode => {
				let content = questionBankNode.content

				return {
					choose: content.choose || Infinity,
					select: content.select || 'sequential'
				}
			}

			let shuffleArray = function(array) {
				var currentIndex = array.length,
					temporaryValue,
					randomIndex

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {
					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex)
					currentIndex -= 1

					// And swap it with the current element.
					temporaryValue = array[currentIndex]
					array[currentIndex] = array[randomIndex]
					array[randomIndex] = temporaryValue
				}

				return array
			}

			let childrenIds = assessment.children[1].childrenSet

			// console.log('childrenSet', childrenIds)

			let uses = new Map()
			childrenIds.forEach(id => {
				let type = assessment.draftTree.getChildNodeById(id).node.type
				if (
					type === 'ObojoboDraft.Chunks.QuestionBank' ||
					type === 'ObojoboDraft.Chunks.Question'
				) {
					uses.set(id, 0)
				}
			})

			historyTree = assessment.children[1].toObject()

			let constructUses = function(node) {
				// console.log('CU', node)
				if (uses.has(node.id)) {
					uses.set(node.id, uses.get(node.id) + 1)
				}

				for (let i in node.children) {
					constructUses(node.children[i])
				}
			}

			for (let i in attemptHistory) {
				// console.log('hisotry', attemptHistory[i])
				if (attemptHistory[i].state.qb) constructUses(attemptHistory[i].state.qb)
			}

			logger.log('uses___', uses)

			assessmentQBTree = assessment.children[1].toObject()
			// console.log('assessmentQBTree', assessmentQBTree)

			let chooseChildren = function(choose, select, node) {
				logger.log('choose children', choose, select, node.id)

				let draftNode = assessment.draftTree.getChildNodeById(node.id)
				let myChildren = [...draftNode.immediateChildrenSet]

				if (!select) select = 'sequential'

				switch (select) {
					case 'sequential':
						myChildren.sort(function(a, b) {
							return uses.get(a) - uses.get(b)
						})

						var myChildrenDraftNodes = myChildren.map(id => {
							return assessment.draftTree.getChildNodeById(id).toObject()
						})

						var slice = myChildrenDraftNodes.slice(0, choose)

						break

					case 'random-all':
						myChildren = shuffleArray(myChildren)

						var myChildrenDraftNodes = myChildren.map(id => {
							return assessment.draftTree.getChildNodeById(id).toObject()
						})

						var slice = myChildrenDraftNodes.slice(0, choose)

						break

					case 'random-unseen':
						myChildren.sort(function(a, b) {
							if (uses.get(a) === uses.get(b)) {
								return Math.random() < 0.5 ? -1 : 1
							}
							return uses.get(a) - uses.get(b)
						})

						var myChildrenDraftNodes = myChildren.map(id => {
							return assessment.draftTree.getChildNodeById(id).toObject()
						})

						var slice = myChildrenDraftNodes.slice(0, choose)

						break
				}

				logger.log(
					'i chose',
					slice.map(function(dn) {
						return dn.id
					})
				)

				return slice
			}

			let trimTree = function(node) {
				if (node.type === 'ObojoboDraft.Chunks.QuestionBank') {
					logger.log('TEST', node.id, node.content, node.content.choose)
					let opts = getBankOptions(node)
					node.children = chooseChildren(opts.choose, opts.select, node)
				}

				for (let i in node.children) {
					trimTree(node.children[i])
				}
			}

			trimTree(assessmentQBTree)

			let questions = []
			let flattenTree = function(node) {
				if (node.type === 'ObojoboDraft.Chunks.Question') {
					questions.push(assessment.draftTree.getChildNodeById(node.id))
				}

				for (let i in node.children) {
					flattenTree(node.children[i])
				}
			}

			flattenTree(assessmentQBTree)

			// console.log('FLAT TREE', questions)
			// return;

			// let buildAssessmentTree = (draftNode) => {
			// 	console.log('BAT', draftNode)
			// 	let o = {
			// 		id: draftNode.node.id,
			// 		children: []
			// 	}

			// 	for(i in draftNode.children)
			// 	{
			// 		let child = draftNode.draftTree.getChildNodeById(draftNode.children[i])
			// 		o.children.push(buildAssessmentTree(child))
			// 	}

			// 	return o
			// }

			// let questionTree = buildAssessmentTree(assessment.children[1])

			// console.log('QT', questionTree)

			attemptState = {
				qb: assessmentQBTree,
				questions: questions,
				data: {}
			}

			// console.log('ObojoboDraft.Sections.Assessment:attemptStart BEGIN', assessment.children[1].node.id)

			// let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptStart', req, res, assessment, attemptHistory, {
			// 	getQuestions: function() { return attemptState.questions },
			// 	setQuestions: function(q) { attemptState.questions = q },
			// 	getData:      function() { return attemptState.data },
			// 	setData:      function(d) { attemptState.data = d },
			// })

			// console.log('ObojoboDraft.Sections.Assessment:attemptStart END', attemptState.questions.length)

			// return Promise.all(promises)
			// 	return true
			// })
			// .then(() => {
			let promises = []
			for (let i in attemptState.questions) {
				promises = promises.concat(
					attemptState.questions[i].yell(
						'ObojoboDraft.Sections.Assessment:sendToAssessment',
						req,
						res
					)
				)
			}
			return Promise.all(promises)
		})
		.then(() => {
			let questionObjects = attemptState.questions.map(question => {
				return question.toObject()
			})
			return Assessment.insertNewAttempt(
				currentUser.id,
				req.body.draftId,
				req.body.assessmentId,
				{
					questions: questionObjects,
					data: attemptState.data,
					qb: assessmentQBTree
				},
				isPreviewing
			)
		})
		.then(result => {
			res.success(result)
			let { createAssessmentAttemptStartedEvent } = createCaliperEvent(null, req.hostname)
			insertEvent({
				action: 'assessment:attemptStart',
				actorTime: new Date().toISOString(),
				payload: { attemptId: result.attemptId, attemptCount: numAttempts },
				userId: currentUser.id,
				ip: req.connection.remoteAddress,
				metadata: {},
				draftId: draftId,
				eventVersion: '1.1.0',
				caliperPayload: createAssessmentAttemptStartedEvent({
					actor: { type: 'user', id: currentUser.id },
					draftId,
					assessmentId: req.body.assessmentId,
					attemptId: result.attemptId,
					isPreviewMode: isPreviewing,
					extensions: {
						count: numAttempts
					}
				})
			})
		})
		.catch(error => {
			// console.log('attempt start error', error)

			switch (error.message) {
				case 'Attempt limit reached':
					return res.reject('Attempt limit reached')

				default:
					logAndRespondToUnexpected(
						res,
						error,
						new Error('Unexpected error starting a new attempt')
					)
			}
		})
})

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	req
		.requireCurrentUser()
		.then(currentUser => {
			let isPreviewing = currentUser.canViewEditor
			return endAttempt(req, res, currentUser, req.params.attemptId, isPreviewing)
		})
		.then(resp => {
			res.success(resp)
		})
		.catch(error => {
			logAndRespondToUnexpected(res, error, new Error('Unexpected error completing your attempt'))
		})
})

app.get('/api/assessments/:draftId/:assessmentId/attempt/:attemptId', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempt(
				currentUser.id,
				req.params.draftId,
				req.params.assessmentId,
				req.params.attemptId
			)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			console.log('error', error, error.toString())
			logAndRespondToUnexpected(
				res,
				error,
				new Error('Unexpected Error Loading attempt "${:attemptId}"')
			)
		})
})

app.get('/api/assessments/:draftId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempts(currentUser.id, req.params.draftId)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			switch (error.message) {
				case 'Login Required':
					res.notAuthorized(error.message)
					return next()

				default:
					logAndRespondToUnexpected(res, error, Error('Unexpected error loading attempts'))
			}
		})
})

app.get('/api/assessment/:draftId/:assessmentId/attempts', (req, res, next) => {
	// check perms
	req
		.requireCurrentUser()
		.then(currentUser => {
			// check input
			// select
			return Assessment.getAttempts(currentUser.id, req.params.draftId, req.params.assessmentId)
		})
		.then(result => {
			res.success(result)
		})
		.catch(error => {
			switch (error.message) {
				case 'Login Required':
					res.notAuthorized(error.message)
					return next()

				default:
					logAndRespondToUnexpected(res, error, Error('Unexpected error loading attempts'))
			}
		})
})

oboEvents.on('client:question:setResponse', (event, req) => {
	if (!event.payload.context) return
	let eventRecordResponse = 'client:question:setResponse'

	// check perms
	// check input
	if (!event.payload.attemptId)
		return logger.error(eventRecordResponse, 'Missing Attempt ID', req, event)
	if (!event.payload.questionId)
		return logger.error(eventRecordResponse, 'Missing Question ID', req, event)
	if (!event.payload.response)
		return logger.error(eventRecordResponse, 'Missing Response', req, event)

	return db
		.none(
			`
			INSERT INTO attempts_question_responses
			(attempt_id, question_id, response, assessment_id)
			VALUES($[attemptId], $[questionId], $[response], $[assessmentId])
			ON CONFLICT (attempt_id, question_id) DO
				UPDATE
				SET
					response = $[response],
					updated_at = now()
				WHERE attempts_question_responses.attempt_id = $[attemptId]
					AND attempts_question_responses.question_id = $[questionId]`,
			{
				assessmentId: event.payload.assessmentId,
				attemptId: event.payload.attemptId,
				questionId: event.payload.questionId,
				response: event.payload.response
			}
		)
		.catch(error => {
			logger.error(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString())
		})
})

module.exports = app

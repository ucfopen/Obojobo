let express = require('express');
let app = express();
let DraftModel = oboRequire('models/draft');
let db = oboRequire('db');
let Assessment = require('./assessment');
let lti = oboRequire('lti')
let insertEvent = oboRequire('insert_event')
let getIp = oboRequire('get_ip')

let logAndRespondToUnexpected = (errorMessage, res, req, jsError) => {
	console.error('logAndRespondToUnexpected', jsError, errorMessage);
	res.unexpected(jsError)
}

app.post('/api/assessments/attempt/start', (req, res, next) => {
	let currentUser
	let draftId = req.body.draftId
	let draftTree
	let attemptState
	let isPreviewing
	let attemptHistory
	let assessmentQBTree

	req.requireCurrentUser()
	.then(user => {
		currentUser = user
		isPreviewing = currentUser.canViewEditor

		return DraftModel.fetchById(draftId)
	})
	.then(draft => {
		draftTree = draft

		return Assessment.getCompletedAssessmentAttemptHistory(currentUser.id, req.body.draftId, req.body.assessmentId, true)
	})
	.then(result => {
		attemptHistory = result
		return Assessment.getNumberAttemptsTaken(currentUser.id, req.body.draftId, req.body.assessmentId)
	})
	.then(numAttempts => {
		var assessment = draftTree.findNodeClass(req.body.assessmentId)

		if(!isPreviewing && assessment.node.content.attempts && (numAttempts >= assessment.node.content.attempts))
		{
			throw new Error('Attempt limit reached')
		}

		// 1. create a tree structure from the assessment question bank
		// 2. create another tree structure from the attempt history
		// 3. use the attempt history and node settings to trim the tree,
		//  leaving only the nodes to send to the client
		// 4. flatten the tree to only questions

		let getBankOptions = (questionBankNode) => {
			let content = questionBankNode.content

			return ({
				choose: content.choose    || Infinity,
				select: content.select    || 'sequential',
			})
		}

		let shuffleArray = function(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;

			// While there remain elements to shuffle...
			while (0 !== currentIndex) {

				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}


		let childrenIds = assessment.children[1].childrenSet

		// console.log('childrenSet', childrenIds)

		let uses = new Map()
		childrenIds.forEach( (id) => {
			let type = assessment.draftTree.findNodeClass(id).node.type
			if(type === 'ObojoboDraft.Chunks.QuestionBank' || type === 'ObojoboDraft.Chunks.Question')
			{
				uses.set(id, 0)
			}
		})

		historyTree = assessment.children[1].toObject()

		let constructUses = function(node)
		{
			// console.log('CU', node)
			if(uses.has(node.id))
			{
				uses.set(node.id, uses.get(node.id) + 1)
			}

			for(let i in node.children)
			{
				constructUses(node.children[i])
			}
		}

		for(let i in attemptHistory)
		{
			// console.log('hisotry', attemptHistory[i])
			if(attemptHistory[i].state.qb) constructUses(attemptHistory[i].state.qb)
		}

		console.log('uses___', uses)

		assessmentQBTree = assessment.children[1].toObject()
		// console.log('assessmentQBTree', assessmentQBTree)

		let chooseChildren = function(choose, select, node)
		{
			console.log('choose children', choose, select, node.id)


			let draftNode = assessment.draftTree.findNodeClass(node.id)
			let myChildren = [...draftNode.immediateChildrenSet]

			if(!select) select = 'sequential';



			switch(select)
			{
				case 'sequential':


					myChildren.sort(function(a, b) {
						return uses.get(a) - uses.get(b)
					})

					var myChildrenDraftNodes = myChildren.map( (id) => {
						return assessment.draftTree.findNodeClass(id).toObject()
					})

					var slice = myChildrenDraftNodes.slice(0, choose)

					break

				case 'random-all':
					myChildren = shuffleArray(myChildren)

					var myChildrenDraftNodes = myChildren.map( (id) => {
						return assessment.draftTree.findNodeClass(id).toObject()
					})

					var slice = myChildrenDraftNodes.slice(0, choose)

					break

				case 'random-unseen':

					myChildren.sort(function(a, b) {
						if(uses.get(a) === uses.get(b))
						{
							return Math.random() < 0.5 ? -1 : 1;
						}
						return uses.get(a) - uses.get(b)
					})

					var myChildrenDraftNodes = myChildren.map( (id) => {
						return assessment.draftTree.findNodeClass(id).toObject()
					})

					var slice = myChildrenDraftNodes.slice(0, choose)

					break
			}



			console.log('i chose', slice.map(function(dn) { return dn.id }))

			return slice
		}

		let trimTree = function(node)
		{
			if(node.type === 'ObojoboDraft.Chunks.QuestionBank')
			{
				console.log('TEST', node.id, node.content, node.content.choose)
				let opts = getBankOptions(node)
				node.children = chooseChildren(opts.choose, opts.select, node)
			}

			for(let i in node.children)
			{
				trimTree(node.children[i])
			}
		}

		trimTree(assessmentQBTree)

		let questions = []
		let flattenTree = function(node)
		{
			if(node.type === 'ObojoboDraft.Chunks.Question')
			{
				questions.push(assessment.draftTree.findNodeClass(node.id))
			}

			for(let i in node.children)
			{
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
		// 		let child = draftNode.draftTree.findNodeClass(draftNode.children[i])
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
		for(let i in attemptState.questions)
		{
			promises = promises.concat(attemptState.questions[i].yell('ObojoboDraft.Sections.Assessment:sendToAssessment', req, res))
		}
		return Promise.all(promises)
	})
	.then(() => {
		let questionObjects = attemptState.questions.map( (question) => { return question.toObject() } )
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

		insertEvent({
			action: 'assessment:attemptStart',
			actorTime: new Date().toISOString(),
			payload: { attemptId:result.attemptId },
			userId: currentUser.id,
			ip: getIp(req),
			metadata: {},
			draftId: draftId
		})
	})
	.catch(error => {
		// console.log('attempt start error', error)

		switch(error.message)
		{
			case 'Attempt limit reached':
				return res.reject('Attempt limit reached')

			default:
				logAndRespondToUnexpected('Unexpected DB error', res, req, error)
		}
	})

})

app.post('/api/assessments/attempt/:attemptId/end', (req, res, next) => {
	// check perms

	// references to hold on to from various responses (so we don't have to nest thens)
	let updateResult
	let draftTree
	let attemptState
	let draftId
	let assessmentId
	let score
	let attemptHistory
	let maxAttemptScore
	let state
	let currentUser
	let isPreviewing

	req.requireCurrentUser()
	.then(user => {
		currentUser = user
		isPreviewing = user.canViewEditor
		// check input
		// insert
		// get draft and assessment ids for this attempt
		return db.one(`
			SELECT drafts.id AS draft_id, attempts.assessment_id, attempts.state as attempt_state
			FROM drafts
			JOIN attempts
			ON drafts.id = attempts.draft_id
			WHERE attempts.id = $1
		`, [req.params.attemptId])
	})
	.then(result => {
		assessmentId = result.assessment_id
		attemptState = result.attempt_state
		draftId = result.draft_id

		return DraftModel.fetchById(draftId)
	})
	.then(draft => {
		draftTree = draft
		return db.any(`
			SELECT *
			FROM attempts_question_responses
			WHERE attempt_id = $1
			`, [req.params.attemptId])
	})
	.then(responseHistory => {
		var assessment = draftTree.findNodeClass(assessmentId)
		state = {
			scores: [0],
			questions: attemptState.questions,
			scoresByQuestionId: {}
		}

		let promises = assessment.yell('ObojoboDraft.Sections.Assessment:attemptEnd', req, res, assessment, responseHistory, {
			getQuestions: () => { return state.questions },
			addScore: (questionId, score) => {
				state.scores.push(score);
				state.scoresByQuestionId[questionId] = score;
			}
		})

		return Promise.all(promises)
	})
	.then(() => {
		score = state.scores.reduce( (a, b) => { return a + b } ) / state.questions.length

		let scores = state.questions.map(question => {
			return {
				id: question.id,
				score: state.scoresByQuestionId[question.id] || 0
			}
		})

		let result = {
			attemptScore: score,
			scores: scores
		}
		return Assessment.updateAttempt(result, req.params.attemptId)
	})
	.then((updateAttemptResult) => {
		updateResult = updateAttemptResult
		return Assessment.getCompletedAssessmentAttemptHistory(currentUser.id, draftId, assessmentId, false)
	})
	.then((attemptHistory) => {
		if(isPreviewing) return Promise.resolve(false)

		let allScores = attemptHistory.map( attempt => { return parseFloat(attempt.result.attemptScore) } )
		maxAttemptScore = Math.max(0, ...allScores);

		return lti.replaceResult(currentUser.id, draftId, maxAttemptScore / 100)
	})
	.then(isScoreSent => {
		updateResult.ltiOutcomes = {
			sent: isScoreSent,
		}
		res.success(updateResult)

		insertEvent({
			action: 'assessment:attemptEnd',
			actorTime: new Date().toISOString(),
			payload: { attemptId: req.params.attemptId },
			userId: currentUser.id,
			ip: getIp(req),
			metadata: {},
			draftId: draftId
		})
	})
	.catch(error => {
		console.log('error', error, error.toString());
		logAndRespondToUnexpected('Unexpected error', res, req, Error('Unexpected Error Completing your attempt.'))
	})
})

// gets the current user's attempts for all assessments for a specific draft
app.get('/api/drafts/:draftId/attempts', (req, res, next) => {
	// check perms
	req.requireCurrentUser()
	.then(currentUser => {
		// check input
		// select
		return db.manyOrNone(`
			SELECT
				id AS "attemptId",
				created_at as "startDate",
				completed_at as "endDate",
				assessment_id,
				state,
				score
			FROM attempts
			WHERE user_id = $[userId]
				AND draft_id = $[draftId]
			ORDER BY completed_at DESC`
			, {userId: currentUser.id, draftId: req.params.draftId})
	})
	.then(result => {
		res.success({attempts: result})
	})
	.catch(error => {
		console.log('error', error, error.toString());
		logAndRespondToUnexpected('Unexpected error', res, req, Error('Unexpected Error Loading attempts.'))
	})
})

global.oboEvents.on('client:assessment:recordResponse', (event, req) => {
	let eventRecordResponse = 'client:assessment:recordResponse'


	// check perms
	// check input
	if(!event.payload.attemptId)   return app.logError(eventRecordResponse, 'Missing Attempt ID', req, event)
	if(!event.payload.questionId)  return app.logError(eventRecordResponse, 'Missing Question ID', req, event)
	if(!event.payload.responderId) return app.logError(eventRecordResponse, 'Missing Responder ID', req, event)
	if(!event.payload.response)    return app.logError(eventRecordResponse, 'Missing Response', req, event)

	db.none(`
		INSERT INTO attempts_question_responses
		(attempt_id, question_id, responder_id, response)
		VALUES($[attemptId], $[questionId], $[responderId], $[response])
		ON CONFLICT (attempt_id, question_id, responder_id) DO
			UPDATE
			SET
				responder_id = $[responderId],
				response = $[response],
				updated_at = now()
			WHERE attempts_question_responses.attempt_id = $[attemptId]
				AND attempts_question_responses.question_id = $[questionId]`
		, {attemptId: event.payload.attemptId, questionId: event.payload.questionId, responderId: event.payload.responderId, response: event.payload.response})
	.catch( error => {
		console.log(error);
		app.logError(eventRecordResponse, 'DB UNEXPECTED', req, error, error.toString());
	})
});


module.exports = app

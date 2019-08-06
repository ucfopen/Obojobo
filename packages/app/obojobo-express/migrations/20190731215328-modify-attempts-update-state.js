'use strict'

var dbm
var type
var seed

/*
Old data structure:
* qb is the primary assessment question bank
* questions are the chosen questions
{
  qb: {
    id: ...,
    type: 'ObojoboDraft.Chunks.QuestionBank',
    children: [ ... ]
  },
  questions: [
    { }, { }, { }
  ]
}

New data structure:
* chosen is an array of objects with id and type
  (either ObojoboDraft.Chunks.Question or ObojoboDraft.Chunks.QuestionBank)
{
  chosen: [
    { id: ..., type: ... },
    ...
  ]
}
*/

// Convert a nested object of parents into a flat list
var toParents = node => {
	const parents = []
	let target = node
	while (target && target.type === 'ObojoboDraft.Chunks.QuestionBank') {
		parents.push(target)
		target = target._parent
	}

	return parents
}

// Convert a nested `questions` object into a hash of questions by ID and the result
var toHash = node => {
	let questions = {}

	if (node.type === 'ObojoboDraft.Chunks.Question') {
		questions[node.id] = node
	}

	if (node.children instanceof Array) {
		node.children.forEach(child => {
			if (!child || !child.type) {
				console.log('Unexpected child discovered')
				console.log(child)
				console.log(parent)
				return
			}

			child._parent = node
			const childQuestions = toHash(child)
			questions = { ...questions, ...childQuestions }
		})
	}

	node.parents = toParents(node._parent)

	delete node._parent

	return questions
}

var getQuestions = (node, questionIds) => {
	const hash = toHash(node)
	const sortedQuestions = []

	questionIds.forEach(qid => {
		sortedQuestions.push(hash[qid])
	})

	return sortedQuestions
}

var getChosen = (node, questionIds) => {
	let questions = getQuestions(node, questionIds)

	questions.forEach(q => {
		questions = questions.concat(q.parents)
	})

	// filter out duplicates
	const foundIds = {}
	questions = questions.filter(q => {
		if (foundIds[q.id]) return false
		foundIds[q.id] = true
		return true
	})

	return questions
}

var toStateObject = (root, questionIds) => {
	const questions = getChosen(root, questionIds)
	const questionObjects = questions
		.map(q => ({ id: q.id, type: q.type }))
		.filter(q => {
			return q.id !== root.id
		})

	return {
		chosen: questionObjects
	}
}

var selectAttemptRecords = async (db, limit, offset) => {
	return db
		.runSql(
			`
  SELECT
    id,
    state
  FROM attempts
  LIMIT ${limit} OFFSET ${offset}
`
		)
		.then(result => {
			return result.rows
		})
}

var processAttemptRecords = async (db, limit, offset) => {
	let updates = []

	// Retreive 500 attempts at a time
	const records = await selectAttemptRecords(db, 500, offset)

	// Update the selected attempts with the updated state object
	records.forEach(r => {
		const attemptId = r.id
		const newState = JSON.stringify(toStateObject(r.state.qb, r.state.questions.map(q => q.id)))

		// Create one large update query
		updates.push(`
      UPDATE
        attempts
      SET
        state='${newState}'
      WHERE
        attempts.id='${attemptId}'
    `)
	})

	updates = updates.join(';')

	// Run the single update query and return the number of records that were processed
	return db.runSql(updates).then(result => records.length)
}

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate
	type = dbm.dataType
	seed = seedLink
}

exports.up = async function(db) {
	let numRecordsProcessed = null
	let offset = 0

	while (numRecordsProcessed === null || numRecordsProcessed.length > 0) {
		numRecordsProcessed = await processAttemptRecords(db, 500, offset)
		offset += 500
	}
}

exports.down = function(db) {
	return null
}

exports._meta = {
	version: 1
}

jest.mock('obojobo-express/server/logger')

const Util = require('./util')
const logger = require('obojobo-express/server/logger')

const QUESTION_NODE_TYPE = 'ObojoboDraft.Chunks.Question'
const QUESTION_BANK_NODE_TYPE = 'ObojoboDraft.Chunks.QuestionBank'

describe('Util', () => {
	beforeEach(() => {
		jest.resetAllMocks()
		jest.restoreAllMocks()
		jest.clearAllMocks()
	})

	const makeNodeWithTextValue = value => ({
		content: {
			textGroup: [
				{
					text: { value }
				}
			]
		}
	})

	test('replaceVariableInNode does nothing if the target node has no text groups', () => {
		jest.spyOn(Util, 'replaceVariableInNode')

		const mockDraftNode = {
			node: {
				content: { key: 'val' }
			}
		}

		Util.replaceVariableInNode(mockDraftNode, 'varName', 'nodeId:varName')

		expect(Util.replaceVariableInNode).toHaveBeenCalledTimes(1)
	})
	test('replaceVariableInNode does nothing if the target variable is not found - no recursion', () => {
		const mockDraftNode = {
			node: makeNodeWithTextValue('text')
		}

		Util.replaceVariableInNode(mockDraftNode, 'varName', 'nodeId:varName')

		// no change should occur
		expect(mockDraftNode.node.content.textGroup[0].text.value).toBe('text')
	})
	test('replaceVariableInNode replaces text if the target variable is found - no recursion', () => {
		const mockDraftNode = {
			node: makeNodeWithTextValue('{{$varName}}')
		}

		Util.replaceVariableInNode(mockDraftNode, 'varName', 'nodeId:varName')

		// text value should be changed
		expect(mockDraftNode.node.content.textGroup[0].text.value).toBe('{{$nodeId:varName}}')
	})
	test('replaceVariableInNode replaces text if the target variable is found - recursion', () => {
		const mockDraftNode = {
			node: {},
			children: [
				{
					node: makeNodeWithTextValue('{{$varName}}')
				},
				{
					node: makeNodeWithTextValue('{{$someOtherVarName}}')
				}
			]
		}

		Util.replaceVariableInNode(mockDraftNode, 'varName', 'nodeId:varName')

		// text value should be changed
		expect(mockDraftNode.children[0].node.content.textGroup[0].text.value).toBe(
			'{{$nodeId:varName}}'
		)
		expect(mockDraftNode.children[1].node.content.textGroup[0].text.value).toBe(
			'{{$someOtherVarName}}'
		)
	})

	test('getFullQuestionsFromDraftTree returns full questions', () => {
		const mockDraftTree = {
			getChildNodeById: jest.fn().mockReturnValueOnce({
				id: 'mockQuestion',
				type: QUESTION_NODE_TYPE,
				children: [],
				yell: jest.fn(),
				toObject: jest.fn().mockReturnValueOnce({})
			})
		}

		const mockQuestionsMetadata = [
			{
				id: 'mockQuestion',
				type: QUESTION_NODE_TYPE
			},
			{
				id: 'mockQuestionBank',
				type: QUESTION_BANK_NODE_TYPE
			}
		]

		const questions = Util.getFullQuestionsFromDraftTree(mockDraftTree, mockQuestionsMetadata)

		// The questions metadata contains a question bank and a question. getFullQuestionsFromDraftTree
		// should only act on questions and ignore question banks
		expect(mockDraftTree.getChildNodeById).toHaveBeenCalledTimes(1)
		expect(questions.length).toEqual(1)
	})
	test('getFullQuestionsFromDraftTree performs variable substitutions where necessary', () => {
		const mockQuestionNode = {
			id: 'mockQuestion',
			type: QUESTION_NODE_TYPE,
			node: makeNodeWithTextValue('{{$varName}}'),
			children: [],
			yell: jest.fn(),
			toObject: jest.fn().mockReturnValueOnce({})
		}

		const mockDraftTree = {
			getChildNodeById: jest.fn().mockReturnValueOnce(mockQuestionNode)
		}

		const mockQuestionsMetadata = [
			{
				id: 'mockQuestion',
				type: QUESTION_NODE_TYPE,
				varRef: [
					// this shouldn't happen, but just to make sure there are no errors if it does
					null,
					{
						var: 'varName',
						ref: 'nodeId'
					}
				]
			},
			{
				id: 'mockQuestionBank',
				type: QUESTION_BANK_NODE_TYPE
			}
		]

		const questions = Util.getFullQuestionsFromDraftTree(mockDraftTree, mockQuestionsMetadata)

		// The questions metadata contains a question bank and a question. getFullQuestionsFromDraftTree
		// should only act on questions and ignore question banks
		expect(mockDraftTree.getChildNodeById).toHaveBeenCalledTimes(1)
		expect(questions.length).toEqual(1)
		// ordinarily this would be the return of the function, but we mocked toObject so we can
		//  check the original instead
		expect(mockQuestionNode.node.content.textGroup[0].text.value).toBe('{{$nodeId:varName}}')
	})

	test('getRandom calls Math.random', () => {
		jest.spyOn(Math, 'random')
		Util.getRandom()
		expect(Math.random).toHaveBeenCalled()
	})

	test('logAndRespondToUnexpected calls res.unexpected and logs error', () => {
		const res = {
			unexpected: jest.fn()
		}
		const req = {}
		const mockError = new Error('mockUnexpectedError')

		Util.logAndRespondToUnexpected(mockError.message, res, req, mockError)
		expect(res.unexpected).toHaveBeenCalledWith('mockUnexpectedError')
		expect(logger.error).toHaveBeenCalledWith(
			'logAndRespondToUnexpected',
			'mockUnexpectedError',
			mockError
		)
	})

	test('getVariablesUsedInNode returns null if no variables are in a node - no recursion', () => {
		const mockNode = makeNodeWithTextValue('text')
		const returnValues = Util.getVariablesUsedInNode(mockNode)

		expect(returnValues).toBeNull()
	})
	test('getVariablesUsedInNode returns null if no variables are in a node - recursion', () => {
		const mockNode = {
			content: {},
			children: [
				{
					node: {
						content: {}
					}
				},
				{
					node: {
						content: {}
					}
				}
			]
		}
		const returnValues = Util.getVariablesUsedInNode(mockNode)

		expect(returnValues).toBeNull()
	})
	test('getVariablesUsedInNode returns a list of variables found in a node - no recursion', () => {
		const mockNode = makeNodeWithTextValue('{{$varName1}}, also {{$varName2}}')
		const returnValues = Util.getVariablesUsedInNode(mockNode)

		expect(returnValues).toEqual(['$varName1', '$varName2'])
	})
	test('getVariablesUsedInNode returns a list of variables found in a node - recursion', () => {
		const mockNode = {
			content: {},
			children: [makeNodeWithTextValue('{{$varName1}}'), makeNodeWithTextValue('{{$varName2}}')]
		}
		const returnValues = Util.getVariablesUsedInNode(mockNode)

		expect(returnValues).toEqual(['$varName1', '$varName2'])
	})

	const makeNodeWithVariables = (nodeId, variablesIn) => {
		// variables will also have a 'value' property, but that doesn't matter for testing
		const variablesOut = variablesIn.map(name => ({ name }))
		return {
			id: nodeId,
			content: {
				variables: variablesOut
			}
		}
	}

	test('getVariableOwner does nothing if a node does not own a target variable and has no parent', () => {
		const mockGetChildNodeById = jest.fn()
		const mockDraftTree = {
			getChildNodeById: mockGetChildNodeById
		}
		const mockNode = { content: {} }

		const returnValue = Util.getVariableOwner(mockDraftTree, mockNode, 'var')
		expect(mockGetChildNodeById).not.toHaveBeenCalled()
		expect(returnValue).toBeUndefined()
	})
	test('getVariableOwner returns a reference object if a node owns a target variable', () => {
		const mockGetChildNodeById = jest.fn()
		const mockDraftTree = {
			getChildNodeById: mockGetChildNodeById
		}
		const mockNode = makeNodeWithVariables('nodeId', ['var'])

		const returnValue = Util.getVariableOwner(mockDraftTree, mockNode, 'var')
		expect(mockGetChildNodeById).not.toHaveBeenCalled()
		expect(returnValue).toEqual({ ref: 'nodeId', var: 'var' })
	})
	test("getVariableOwner returns a reference object if a node's ancestor owns a target variable", () => {
		const mockGetChildNodeById = jest
			.fn()
			.mockReturnValueOnce({
				node: {
					content: {},
					parentId: 'grandparentNodeId'
				}
			})
			.mockReturnValueOnce({
				node: makeNodeWithVariables('grandparentNodeId', ['var'])
			})
		const mockDraftTree = {
			getChildNodeById: mockGetChildNodeById
		}
		const mockNode = {
			content: {},
			parentId: 'parentNodeId'
		}

		const returnValue = Util.getVariableOwner(mockDraftTree, mockNode, 'var')
		expect(mockGetChildNodeById).toHaveBeenCalledTimes(2)
		expect(mockGetChildNodeById.mock.calls[0]).toEqual(['parentNodeId'])
		expect(mockGetChildNodeById.mock.calls[1]).toEqual(['grandparentNodeId'])
		expect(returnValue).toEqual({ ref: 'grandparentNodeId', var: 'var' })
	})
})

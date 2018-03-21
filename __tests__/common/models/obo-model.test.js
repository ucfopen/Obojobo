import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
import createUUID from '../../../src/scripts/common/util/uuid'
import { Store } from '../../../src/scripts/common/store'

jest.mock('../../../src/scripts/common/models/obo-model', () => {
	return require('../../../__mocks__/obo-model-mock').default
})

jest.mock('../../../src/scripts/common/flux/dispatcher', () => {
	return {
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	}
})
// jest.mock('../../../../src/scripts/common/util/uuid', () => {
// 	return jest.fn().mockImplementation( () => { return 4; } )
// })

describe('OboModel', () => {
	// let testModel = {
	// 	get: () => 'testId'
	// };

	beforeEach(() => {
		// jest.resetAllMocks()
	})

	// @ADD BACK
	test.skip('should construct a new instance with defaults', () => {
		OboModel.__setNextGeneratedLocalId('testId')

		let o = new OboModel({})

		expect(o.parent).toBe(null)
		expect(o.children.models.length).toBe(0)
		expect(o.triggers).toEqual([])
		expect(o.title).toBe(null)
		expect(o.modelState).toEqual({
			dirty: false,
			needsUpdate: false,
			editing: false
		})
		expect(o.id).toEqual('testId')
		expect(o.adapter.construct).toBeInstanceOf(Function)
		expect(o.adapter.clone).toBeInstanceOf(Function)
		expect(o.adapter.toJSON).toBeInstanceOf(Function)
		expect(o.adapter.toText).toBeInstanceOf(Function)
		expect(OboModel.models.testId).toBe(o)
	})

	test('should construct a new instance with given attributes', () => {
		let o = new OboModel({
			id: 'passedInId',
			content: {
				triggers: [{ passedInTrigger: 1 }],
				title: 'passedInTitle',
				customContent: 'example'
			}
		})

		expect(o.triggers).toEqual([{ passedInTrigger: 1 }])
		expect(o.title).toEqual('passedInTitle')
		expect(o.id).toEqual('passedInId')
		expect(o.get('content').customContent).toEqual('example')
	})

	test('should construct a new instance with a given adapter', () => {
		let o = new OboModel(
			{
				content: {
					score: 100
				}
			},
			{
				construct: (model, attrs) => {
					model.modelState.score = attrs.content.score
				},
				clone: (model, clone) => {
					clone.modelState.isCloneTest = true
					return clone
				},
				toJSON: (model, json) => {
					json.isToJSONTest = true
					return json
				},
				toText: model => {
					return 'toTextTestResult'
				}
			}
		)

		expect(o.modelState.score).toEqual(100)
		expect(o.modelState.isCloneTest).toBeUndefined()
		expect(o.clone().modelState.isCloneTest).toBe(true)
		expect(o.toJSON().isToJSONTest).toBe(true)
		expect(o.toText()).toEqual('toTextTestResult')
	})

	test('should retrieve the root model', done => {
		Store.getItems(items => {
			let o = OboModel.create({
				id: 'root',
				type: 'ObojoboDraft.Modules.Module',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Sections.Content'
					}
				]
			})

			expect(OboModel.models.root.getRoot()).toBe(o)
			expect(OboModel.models.child.getRoot()).toBe(o)

			done()
		})
	})

	test('should process a trigger', () => {
		global.__actionFn = jest.fn()
		let o = new OboModel({
			content: {
				triggers: [
					{
						type: 't1',
						run: 'once',
						actions: [
							{
								type: 'a1',
								value: 1
							},
							{
								type: 'a2',
								value: 2
							}
						]
					},
					{
						type: 't2',
						actions: [
							{
								type: 'a3',
								value: 3
							},
							{
								type: '_js',
								value: '__actionFn()'
							}
						]
					}
				]
			}
		})

		// process t1, should trigger action a1 then a2
		o.processTrigger('t1')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger.mock.calls[0]).toEqual(['a1', { type: 'a1', value: 1 }])
		expect(Dispatcher.trigger.mock.calls[1]).toEqual(['a2', { type: 'a2', value: 2 }])

		// process t1 but since run = 'once' it won't trigger again
		Dispatcher.trigger.mockClear()
		o.processTrigger('t1')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(0)

		// process t2, should trigger action a3 and eval _js
		Dispatcher.trigger.mockClear()
		o.processTrigger('t2')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toEqual(['a3', { type: 'a3', value: 3 }])
		expect(global.__actionFn).toHaveBeenCalledTimes(1)

		// process t3 which isn't defined so nothing should be triggered
		Dispatcher.trigger.mockClear()
		o.processTrigger('t3')

		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		delete global.__actionFn
	})

	//@TODO: Test fails, flags on modelState are broken, skip for now
	test.skip('marking models as dirty sets flags dirty and needsUpdate but does not modify children', done => {
		Store.getItems(items => {
			let o = OboModel.create({
				id: 'ObojoboDraft.Modules.Module',
				type: 'root-type',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Sections.Content'
					}
				]
			})

			expect(OboModel.models.root.modelState.dirty).toBe(false)
			expect(OboModel.models.root.modelState.needsUpdate).toBe(false)
			expect(OboModel.models.child.modelState.dirty).toBe(false)
			expect(OboModel.models.child.modelState.needsUpdate).toBe(false)

			o.markDirty()

			expect(OboModel.models.root.modelState.dirty).toBe(true)
			expect(OboModel.models.root.modelState.needsUpdate).toBe(true)
			expect(OboModel.models.child.modelState.dirty).toBe(false)
			expect(OboModel.models.child.modelState.needsUpdate).toBe(false)

			done()
		})
	})

	test('removing children sets their parent to null, marks them dirty and removes them from the model db', done => {
		Store.getItems(items => {
			let o = OboModel.create({
				id: 'root',
				type: 'ObojoboDraft.Modules.Module',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Sections.Content'
					}
				]
			})

			let child = OboModel.models.child
			child.modelState.dirty = false

			o.children.remove(child)

			expect(child.parent).toBe(null)
			expect(OboModel.models.root.modelState.dirty).toBe(false)
			expect(child.modelState.dirty).toBe(true)

			expect(OboModel.models.child).toBeUndefined()

			done()
		})
	})

	test('adding children sets their parent and marks them dirty', () => {
		let root = new OboModel({})
		let child = new OboModel({})

		expect(root.modelState.dirty).toBe(false)
		expect(child.modelState.dirty).toBe(false)

		root.children.add(child)

		expect(child.parent).toBe(root)
		expect(child.modelState.dirty).toBe(true)
	})

	test('removing children sets their parent to null and marks them dirty', () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)

		root.modelState.dirty = child.modelState.dirty = false

		root.children.remove(child)

		expect(child.parent).toBe(null)
		expect(child.modelState.dirty).toBe(true)
	})

	test("resetting sets the children's parent", () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)
		root.children.reset()

		expect(child.parent).toBe(null)
	})

	test('creates new local IDs', () => {
		let root = new OboModel({})

		OboModel.__setNextGeneratedLocalId(null)

		expect(root.createNewLocalId()).toEqual(
			expect.stringMatching(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			)
		)
	})

	test('assign new id will assign a new id', () => {
		let root = new OboModel({})

		let oldId = root.id

		root.assignNewId()
		expect(root.id).not.toEqual(oldId)
	})

	test("clone (shallow) will clone a model (not it's children)", () => {
		let root = new OboModel({ a: 1 })
		let child = new OboModel({ b: 2 })

		root.children.add(child)

		let clone = root.clone()

		expect(clone.get('a')).toBe(1)
		expect(clone.children.length).toBe(0)
	})

	test("clone (deep) will clone a model (and it's children)", () => {
		let root = new OboModel({ a: 1 })
		let child = new OboModel({ b: 2 })

		root.children.add(child)

		let clone = root.clone(true)

		expect(clone.get('a')).toBe(1)
		expect(clone.children.length).toBe(1)
		expect(clone.children.at(0).get('b')).toBe(2)
	})

	test("clone will clone a model based on it's adapter", () => {
		let root = new OboModel(
			{},
			{
				clone: (model, clone) => {
					clone.set('wasCloned', true)
					return clone
				}
			}
		)

		let clone = root.clone(true)

		expect(root.get('wasCloned')).toBeFalsy()
		expect(clone.get('wasCloned')).toBe(true)
	})

	// @ADD BACK
	test.skip('toJSON will output a model to an object', () => {
		OboModel.__setNextGeneratedLocalId('testId')

		let root = new OboModel({
			type: 'nodeType',
			content: { a: 1 }
		})

		expect(root.toJSON()).toEqual({
			id: 'testId',
			children: null,
			content: { a: 1 },
			index: 0,
			metadata: {},
			type: 'nodeType'
		})
	})

	test("toJSON will output a model to an object according with it's adapter", () => {
		let root = new OboModel(
			{
				type: 'nodeType',
				content: { a: 1 }
			},
			{
				toJSON: (model, json) => {
					json.toJSONWasCalled = true
					return json
				}
			}
		)

		expect(root.toJSON().toJSONWasCalled).toBe(true)
	})

	test.skip('toText will output the model into a text format', () => {
		expect(true).toBe(false)
	})

	test.skip('revert will clear the model but keep the index and id', () => {
		let root = new OboModel({
			type: 'someType',
			content: { a: 1 }
		})
		let child = new OboModel({})

		root.children.add(child)

		let oldId = root.id
		let oldIndex = root.index
		let oldRoot = root

		root.revert()

		expect(root).toBe(oldRoot)
		expect(root.toJSON()).toEqual({
			id: oldId,
			type: '',
			children: null,
			index: oldIndex,
			metadata: {}
		})
	})

	test('markDirty sets the dirty and needsUpdate flags', () => {
		let root = new OboModel({})

		root.modelState.dirty = root.modelState.needsUpdate = false

		root.markDirty()

		expect(root.modelState.dirty).toBe(true)
		expect(root.modelState.needsUpdate).toBe(true)
	})

	test('markForUpdate sets the needsUpdate flag', () => {
		let root = new OboModel({})

		root.modelState.needsUpdate = false

		root.markForUpdate()

		expect(root.modelState.needsUpdate).toBe(true)
	})

	test("markForUpdate sets the needsUpdate flag for itself and it's children if markChildren is true", () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)
		root.modelState.needsUpdate = false
		child.modelState.needsUpdate = false

		root.markForUpdate(true)

		expect(root.modelState.needsUpdate).toBe(true)
		expect(child.modelState.needsUpdate).toBe(true)
	})

	test('markUpdated sets the needsUpdate flag', () => {
		let root = new OboModel({})

		root.modelState.needsUpdate = true

		root.markUpdated()

		expect(root.modelState.needsUpdate).toBe(false)
	})

	test("markUpdated sets the needsUpdate flag for itself and it's children if markChildren is true", () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)
		root.modelState.needsUpdate = true
		child.modelState.needsUpdate = true

		root.markUpdated(true)

		expect(root.modelState.needsUpdate).toBe(false)
		expect(child.modelState.needsUpdate).toBe(false)
	})

	test.skip('getDomEl', () => {
		expect(false).toBe(true)
	})

	test('getComponentClass returns the component class of a model', done => {
		Store.getItems(items => {
			OboModel.create({
				id: 'rootId',
				type: 'ObojoboDraft.Chunks.Text'
			})

			let root = OboModel.models.rootId
			let Text = items.get('ObojoboDraft.Chunks.Text')

			expect(root.getComponentClass()).toBe(Text.componentClass)

			done()
		})
	})

	test('hasChildren reports if a model has children', () => {
		let childless = new OboModel({})
		let hasChild = new OboModel({})
		let child = new OboModel({})

		hasChild.children.add(child)

		expect(childless.hasChildren()).toBe(false)
		expect(hasChild.hasChildren()).toBe(true)
	})

	test('isOrphan reports if a model has no parent', () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)

		expect(child.isOrphan()).toBe(false)
		expect(root.isOrphan()).toBe(true)

		root.children.remove(child)

		expect(child.isOrphan()).toBe(true)
	})

	test('addChildBefore adds a child before', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let newChild = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		childA.addChildBefore(newChild)

		expect(root.children.at(0)).toBe(newChild)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childB)
	})

	test('addChildBefore moves children if child added is already in collection', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childA.addChildBefore(childB)

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childC)
	})

	test('addChildAfter adds a child after', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let newChild = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		childB.addChildAfter(newChild)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childB)
		expect(root.children.at(2)).toBe(newChild)
	})

	test('addChildAfter moves children if child added is already in collection', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childC.addChildAfter(childA)

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childA)
	})

	test('moveTo will move a model to a new index', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.moveTo(0)

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childC)

		childB.moveTo(1)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childB)
		expect(root.children.at(2)).toBe(childC)

		childB.moveTo(2)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childB)

		childB.moveTo(2)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childB)
	})

	test('moveToTop will move a model to the first index', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.moveToTop()

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childC)
	})

	test('moveToBottom will move a model to the last index', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.moveToBottom()

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childB)
	})

	test('prevSibling will return the previous sibling (or null if none exists)', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childC.prevSibling()).toBe(childB)
		expect(childB.prevSibling()).toBe(childA)
		expect(childA.prevSibling()).toBe(null)
		expect(root.prevSibling()).toBe(null)
	})

	test('nextSibling will return the next sibling (or null if none exists)', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childC.nextSibling()).toBe(null)
		expect(childB.nextSibling()).toBe(childC)
		expect(childA.nextSibling()).toBe(childB)
		expect(root.nextSibling()).toBe(null)
	})

	test('getIndex will return the position of the model', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.getIndex()).toBe(0)
		expect(childB.getIndex()).toBe(1)
		expect(childC.getIndex()).toBe(2)
		expect(root.getIndex()).toBe(0)
	})

	test('isFirst will report if a model is the first child', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isFirst()).toBe(true)
		expect(childB.isFirst()).toBe(false)
		expect(childC.isFirst()).toBe(false)
		expect(root.isFirst()).toBe(false)
	})

	test('isLast will report if a model is the last child', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isLast()).toBe(false)
		expect(childB.isLast()).toBe(false)
		expect(childC.isLast()).toBe(true)
		expect(root.isLast()).toBe(false)
	})

	test('isBefore will report if a model is before another model', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isBefore(childA)).toBe(false)
		expect(childA.isBefore(childB)).toBe(true)
		expect(childA.isBefore(childC)).toBe(true)
		expect(childB.isBefore(childA)).toBe(false)
		expect(childA.isBefore(root)).toBe(false)
		expect(root.isBefore(childA)).toBe(false)
	})

	test('isAfter will report if a model is after another model', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isAfter(childA)).toBe(false)
		expect(childA.isAfter(childB)).toBe(false)
		expect(childA.isAfter(childC)).toBe(false)
		expect(childB.isAfter(childA)).toBe(true)
		expect(childA.isAfter(root)).toBe(false)
		expect(root.isAfter(childA)).toBe(false)
	})

	test('remove will remove a model', () => {
		let root = new OboModel({})
		let child = new OboModel({})

		root.children.add(child)

		child.remove()

		expect(root.children.length).toBe(0)
		expect(child.parent).toBe(null)
	})

	test('replaceWith will replace a model with another model', () => {
		let root = new OboModel({})
		let childA = new OboModel({})
		let childB = new OboModel({})
		let childC = new OboModel({})
		let replaceModel = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.replaceWith(replaceModel)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(replaceModel)
		expect(root.children.at(2)).toBe(childC)
	})

	test('contains will report if a model contains a given child', () => {
		let grandparent = new OboModel({})
		let parent = new OboModel({})
		let child = new OboModel({})

		grandparent.children.add(parent)
		parent.children.add(child)

		expect(grandparent.contains(grandparent)).toBe(true)
		expect(parent.contains(grandparent)).toBe(false)
		expect(child.contains(grandparent)).toBe(false)
		expect(grandparent.contains(parent)).toBe(true)
		expect(parent.contains(parent)).toBe(true)
		expect(child.contains(parent)).toBe(false)
		expect(grandparent.contains(child)).toBe(true)
		expect(parent.contains(child)).toBe(true)
		expect(child.contains(child)).toBe(true)
	})

	test('getParentOfType returns a parent of a given type', () => {
		let grandparent = new OboModel({ type: 'grandparent' })
		let parent = new OboModel({ type: 'parent' })
		let child = new OboModel({ type: 'child' })

		grandparent.children.add(parent)
		parent.children.add(child)

		expect(child.getParentOfType('grandparent')).toBe(grandparent)
		expect(child.getParentOfType('parent')).toBe(parent)
		expect(child.getParentOfType('child')).toBe(null)
	})
})

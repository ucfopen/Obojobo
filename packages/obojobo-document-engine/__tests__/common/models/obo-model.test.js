import React from 'react'

import OboModel from '../../../__mocks__/_obo-model-with-chunks'
import Dispatcher from '../../../src/scripts/common/flux/dispatcher'
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

describe('OboModel', () => {
	beforeEach(() => {
		// Keep tests from interfering with each other
		OboModel.models = []
	})

	test('should construct a new instance with defaults', () => {
		const o = new OboModel({ id: 'testId' })

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
		const o = new OboModel({
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
		const o = new OboModel(
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
				toText: () => {
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

	test('should retrieve the root model', () => {
		expect.assertions(2)
		const o = OboModel.create({
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
	})

	test('should process a trigger', () => {
		const o = new OboModel({
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

		// process t2, should trigger action a3
		Dispatcher.trigger.mockClear()
		o.processTrigger('t2')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toEqual(['a3', { type: 'a3', value: 3 }])

		// process t3 which isn't defined so nothing should be triggered
		Dispatcher.trigger.mockClear()
		o.processTrigger('t3')

		expect(Dispatcher.trigger).not.toHaveBeenCalled()
	})

	test('removing children sets their parent to null, marks them dirty and removes them from the model db', () => {
		expect.assertions(4)
		Store.getItems(() => {
			const o = OboModel.create({
				id: 'root',
				type: 'ObojoboDraft.Modules.Module',
				children: [
					{
						id: 'child',
						type: 'ObojoboDraft.Sections.Content'
					}
				]
			})

			const child = OboModel.models.child
			child.modelState.dirty = false

			o.children.remove(child)

			expect(child.parent).toBe(null)
			expect(OboModel.models.root.modelState.dirty).toBe(false)
			expect(child.modelState.dirty).toBe(true)

			expect(OboModel.models.child).toBeUndefined()
		})
	})

	test('adding children sets their parent and marks them dirty', () => {
		const root = new OboModel({})
		const child = new OboModel({})

		expect(root.modelState.dirty).toBe(false)
		expect(child.modelState.dirty).toBe(false)

		root.children.add(child)

		expect(child.parent).toBe(root)
		expect(child.modelState.dirty).toBe(true)
	})

	test('removing children sets their parent to null and marks them dirty', () => {
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)

		root.modelState.dirty = child.modelState.dirty = false

		root.children.remove(child)

		expect(child.parent).toBe(null)
		expect(child.modelState.dirty).toBe(true)
	})

	test("resetting sets the children's parent", () => {
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)
		root.children.reset()

		expect(child.parent).toBe(null)
	})

	test('creates new local IDs', () => {
		const root = new OboModel({})

		OboModel.__setNextGeneratedLocalId(null)

		expect(root.createNewLocalId()).toEqual(
			expect.stringMatching(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			)
		)
	})

	test('assign new id will assign a new id', () => {
		const root = new OboModel({})

		const oldId = root.id

		root.assignNewId()
		expect(root.id).not.toEqual(oldId)
	})

	test("clone (shallow) will clone a model (not it's children)", () => {
		const root = new OboModel({ a: 1 })
		const child = new OboModel({ b: 2 })

		root.children.add(child)

		const clone = root.clone()

		expect(clone.get('a')).toBe(1)
		expect(clone.children.length).toBe(0)
	})

	test("clone (deep) will clone a model (and it's children)", () => {
		const root = new OboModel({ a: 1 })
		const child = new OboModel({ b: 2 })

		root.children.add(child)

		const clone = root.clone(true)

		expect(clone.get('a')).toBe(1)
		expect(clone.children.length).toBe(1)
		expect(clone.children.at(0).get('b')).toBe(2)
	})

	test("clone will clone a model based on it's adapter", () => {
		const root = new OboModel(
			{},
			{
				clone: (model, clone) => {
					clone.set('wasCloned', true)
					return clone
				}
			}
		)

		const clone = root.clone(true)

		expect(root.get('wasCloned')).toBeFalsy()
		expect(clone.get('wasCloned')).toBe(true)
	})

	test('toJSON will output a model to an object', () => {
		const root = new OboModel({
			type: 'nodeType',
			content: { a: 1 }
		})

		expect(root.toJSON()).toEqual({
			id: null,
			children: null,
			content: { a: 1 },
			index: 0,
			metadata: {},
			type: 'nodeType'
		})
	})

	test('toJSON will output a model with children to an object', () => {
		const root = OboModel.create({
			id: 'root',
			type: 'ObojoboDraft.Modules.Module',
			children: [
				{
					id: 'child',
					type: 'ObojoboDraft.Sections.Content'
				}
			]
		})

		expect(root.toJSON()).toEqual({
			children: [
				{
					children: null,
					content: {},
					id: 'child',
					index: 0,
					metadata: {},
					type: 'ObojoboDraft.Sections.Content'
				}
			],
			content: { start: null },
			id: 'root',
			index: 0,
			metadata: {},
			type: 'ObojoboDraft.Modules.Module'
		})
	})

	test("toJSON will output a model to an object according with it's adapter", () => {
		const root = new OboModel(
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

	test('toText will output the model into a text format', () => {
		const parent = new OboModel(
			{
				id: 'parentId',
				type: 'parentType'
			},
			{
				toText() {
					return 'parent text'
				}
			}
		)

		const child = new OboModel(
			{
				id: 'childId',
				type: 'childType'
			},
			{
				toText() {
					return 'child text'
				}
			}
		)

		parent.children.add(child)

		expect(OboModel.models['parentId'].toText()).toBe('parent text\nchild text')
	})

	test('toText will output the model into a text format', () => {
		const m = new OboModel({
			id: 'parentId',
			type: 'parentType'
		})

		expect(m).toBeInstanceOf(OboModel)
		expect(OboModel.models['parentId'].toText()).toBe('')
	})

	test('revert will clear the model but keep the index and id', () => {
		const root = new OboModel({
			type: 'someType',
			content: { a: 1 },
			index: 555
		})
		const child = new OboModel({})

		root.children.add(child)

		const oldId = root.id
		const oldIndex = root.attributes.index

		root.revert()

		expect(root.toJSON()).toEqual({
			id: oldId,
			type: '',
			children: null,
			index: oldIndex,
			content: {},
			metadata: {}
		})
	})

	test('markDirty sets the dirty and needsUpdate flags', () => {
		const root = new OboModel({})

		root.modelState.dirty = root.modelState.needsUpdate = false

		root.markDirty()

		expect(root.modelState.dirty).toBe(true)
		expect(root.modelState.needsUpdate).toBe(true)
	})

	test('markForUpdate sets the needsUpdate flag', () => {
		const root = new OboModel({})

		root.modelState.needsUpdate = false

		root.markForUpdate()

		expect(root.modelState.needsUpdate).toBe(true)
	})

	test("markForUpdate sets the needsUpdate flag for itself and it's children if markChildren is true", () => {
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)
		root.modelState.needsUpdate = false
		child.modelState.needsUpdate = false

		root.markForUpdate(true)

		expect(root.modelState.needsUpdate).toBe(true)
		expect(child.modelState.needsUpdate).toBe(true)
	})

	test('markUpdated sets the needsUpdate flag', () => {
		const root = new OboModel({})

		root.modelState.needsUpdate = true

		root.markUpdated()

		expect(root.modelState.needsUpdate).toBe(false)
	})

	test("markUpdated sets the needsUpdate flag for itself and it's children if markChildren is true", () => {
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)
		root.modelState.needsUpdate = true
		child.modelState.needsUpdate = true

		root.markUpdated(true)

		expect(root.modelState.needsUpdate).toBe(false)
		expect(child.modelState.needsUpdate).toBe(false)
	})

	test('getDomEl', () => {
		const shallow = require('enzyme').shallow
		const Heading = require('ObojoboDraft/Chunks/Heading/viewer-component').default
		const moduleData = require('__mocks__/viewer-state.mock').moduleData
		const initModuleData = require('__mocks__/viewer-state.mock').initModuleData

		const model = OboModel.create({
			id: 'testId',
			type: 'ObojoboDraft.Chunks.Heading'
		})
		initModuleData()
		const component = shallow(<Heading model={model} moduleData={moduleData} />)
		const domHTML = component.html()
		document.body.innerHTML = domHTML
		const domEl = model.getDomEl()
		expect(domEl.attributes[1].value).toBe('obo-testId')
		expect(domEl.attributes[4].value).toBe('ObojoboDraft.Chunks.Heading')
	})

	test('getDomId returns an id for an element', () => {
		const root = OboModel.create({ id: 'mock-id', type: 'ObojoboDraft.Chunks.Heading' })
		expect(root.getDomId()).toEqual('obo-mock-id')
	})

	test('getComponentClass returns the component class of a model', () => {
		expect.assertions(1)
		Store.getItems(items => {
			OboModel.create({
				id: 'rootId',
				type: 'ObojoboDraft.Chunks.Text'
			})

			const root = OboModel.models.rootId
			const Text = items.get('ObojoboDraft.Chunks.Text')

			expect(root.getComponentClass()).toBe(Text.componentClass)
		})
	})

	test('hasChildren reports if a model has children', () => {
		const childless = new OboModel({})
		const hasChild = new OboModel({})
		const child = new OboModel({})

		hasChild.children.add(child)

		expect(childless.hasChildren()).toBe(false)
		expect(hasChild.hasChildren()).toBe(true)
	})

	test('isOrphan reports if a model has no parent', () => {
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)

		expect(child.isOrphan()).toBe(false)
		expect(root.isOrphan()).toBe(true)

		root.children.remove(child)

		expect(child.isOrphan()).toBe(true)
	})

	test('addChildBefore adds a child before', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const newChild = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		childA.addChildBefore(newChild)

		expect(root.children.at(0)).toBe(newChild)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childB)
	})

	test('addChildBefore does not add a child to an orphan', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const newChild = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		root.addChildBefore(newChild)

		expect(root.children.length).toBe(2)
	})

	test('addChildBefore moves children if child added is already in collection', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childA.addChildBefore(childB)

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childC)
	})

	test('addChildAfter adds a child after', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const newChild = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		childB.addChildAfter(newChild)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childB)
		expect(root.children.at(2)).toBe(newChild)
	})

	test('addChildAfter does not add a child after an orphan', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)

		root.addChildAfter(root)

		expect(root.children.length).toBe(2)
	})

	test('addChildAfter moves children if child added is already in collection', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childC.addChildAfter(childA)

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childA)
	})

	test('moveTo will move a model to a new index', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

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
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.moveToTop()

		expect(root.children.at(0)).toBe(childB)
		expect(root.children.at(1)).toBe(childA)
		expect(root.children.at(2)).toBe(childC)
	})

	test('moveToBottom will move a model to the last index', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.moveToBottom()

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(childC)
		expect(root.children.at(2)).toBe(childB)
	})

	test('prevSibling will return the previous sibling (or null if none exists)', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childC.prevSibling()).toBe(childB)
		expect(childB.prevSibling()).toBe(childA)
		expect(childA.prevSibling()).toBe(null)
		expect(root.prevSibling()).toBe(null)
	})

	test('nextSibling will return the next sibling (or null if none exists)', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childC.nextSibling()).toBe(null)
		expect(childB.nextSibling()).toBe(childC)
		expect(childA.nextSibling()).toBe(childB)
		expect(root.nextSibling()).toBe(null)
	})

	test('getIndex will return the position of the model', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.getIndex()).toBe(0)
		expect(childB.getIndex()).toBe(1)
		expect(childC.getIndex()).toBe(2)
		expect(root.getIndex()).toBe(0)
	})

	test('isFirst will report if a model is the first child', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isFirst()).toBe(true)
		expect(childB.isFirst()).toBe(false)
		expect(childC.isFirst()).toBe(false)
		expect(root.isFirst()).toBe(false)
	})

	test('isLast will report if a model is the last child', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		expect(childA.isLast()).toBe(false)
		expect(childB.isLast()).toBe(false)
		expect(childC.isLast()).toBe(true)
		expect(root.isLast()).toBe(false)
	})

	test('isBefore will report if a model is before another model', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

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
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})

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
		const root = new OboModel({})
		const child = new OboModel({})

		root.children.add(child)

		child.remove()

		expect(root.children.length).toBe(0)
		expect(child.parent).toBe(null)
	})

	test('remove will not remove an orphan', () => {
		const root = new OboModel({})

		root.remove()

		expect(root).not.toBe(null)
	})

	test('replaceWith will replace a model with another model', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})
		const replaceModel = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		childB.replaceWith(replaceModel)

		expect(root.children.at(0)).toBe(childA)
		expect(root.children.at(1)).toBe(replaceModel)
		expect(root.children.at(2)).toBe(childC)
	})

	test('replaceWith will not replace an orphan', () => {
		const root = new OboModel({})
		const childA = new OboModel({})
		const childB = new OboModel({})
		const childC = new OboModel({})
		const replaceModel = new OboModel({})

		root.children.add(childA)
		root.children.add(childB)
		root.children.add(childC)

		root.replaceWith(replaceModel)

		expect(root).not.toBe(replaceModel)
	})

	test('contains will report if a model contains a given child', () => {
		const grandparent = new OboModel({})
		const parent = new OboModel({})
		const child = new OboModel({})

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
		const grandparent = new OboModel({ type: 'grandparent' })
		const parent = new OboModel({ type: 'parent' })
		const child = new OboModel({ type: 'child' })

		grandparent.children.add(parent)
		parent.children.add(child)

		expect(child.getParentOfType('grandparent')).toBe(grandparent)
		expect(child.getParentOfType('parent')).toBe(parent)
		expect(child.getParentOfType('child')).toBe(null)
	})

	test('OboModel.getRoot finds the root node', () => {
		const model = OboModel.create({
			id: 'testId',
			type: 'ObojoboDraft.Chunks.Heading'
		})

		expect(OboModel.getRoot()).toEqual(model)
	})

	test('OboModel.getRoot finds the root node', () => {
		expect(OboModel.getRoot()).toEqual(null)
	})

	test('setStateProp returns false if `content` does not exist on model', () => {
		const model = new OboModel({})
		model.unset('content')
		expect(model.setStateProp('prop-name')).toBe(false)
	})

	test('setStateProp sets properties on modelState from content and returns true', () => {
		const model = new OboModel({
			content: {
				a: 1,
				b: 2
			}
		})
		expect(model.modelState).toEqual({
			dirty: false,
			editing: false,
			needsUpdate: false
		})
		expect(model.setStateProp('a', 111)).toBe(true)
		expect(model.setStateProp('c', 333)).toBe(true)
		expect(model.modelState).toEqual({
			dirty: false,
			editing: false,
			needsUpdate: false,
			a: 1,
			c: 333
		})
	})

	test('Obomodel.create builds default chunks', () => {
		const model = OboModel.create('chunk')

		expect(model.toJSON()).toEqual({
			children: null,
			content: {
				textGroup: [
					{
						data: { align: 'left', indent: 0 },
						text: { styleList: null, value: '' }
					}
				]
			},
			id: null,
			index: 0,
			metadata: {},
			type: 'chunk'
		})
	})

	test('Obomodel.create builds nothing', () => {
		const model = OboModel.create('mockChunk')

		expect(model).toEqual(null)
	})

	test('Obomodel.create builds nothing from object', () => {
		const model = OboModel.create({ type: 'mockChunk' })

		expect(model).toEqual(null)
	})
})

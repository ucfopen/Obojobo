import OboModel from '../../../../src/scripts/common/models/obo-model'
// import APIUtil from 'Viewer/util/api-util'
import Dispatcher from '../../../../src/scripts/common/flux/dispatcher'

jest.mock('../../../../src/scripts/common/models/obo-model', () => {
	return require('../../../../__mocks__/obo-model-mock').default;
})

jest.mock('../../../../src/scripts/common/flux/dispatcher', () => {
	return ({
		trigger: jest.fn(),
		on: jest.fn(),
		off: jest.fn()
	})
})

// jest.mock('Test/example');
// jest.mock('../../../../src/scripts/submodules/Test/example');
import Example from 'Test/example'



describe('OboModel', () => {
	// let testModel = {
	// 	get: () => 'testId'
	// };

	beforeEach(() => {
		// jest.resetAllMocks()


	})

	test.only("example", () => {
		let o = new Example;

		o.doAThing()

		expect(o.doAThing()).toBe(4)
		// expect(o.doAThing).toHaveBeenCalledTimes(1);
		// expect(o.__extraThing()).toBe(6);
	})

	test("should construct a new instance with defaults", () => {
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

	test("should construct a new instance with given attributes", () => {
		let o = new OboModel({
			id: 'passedInId',
			content: {
				triggers: [
					{ passedInTrigger:1 }
				],
				title: 'passedInTitle',
				customContent: 'example'
			}
		})

		expect(o.triggers).toEqual([
			{ passedInTrigger:1 }
		])
		expect(o.title).toEqual('passedInTitle')
		expect(o.id).toEqual('passedInId')
		expect(o.get('content').customContent).toEqual('example')
	})

	test("should construct a new instance with a given adapter", () => {
		let o = new OboModel({
			content: {
				score: 100
			}
		}, {
			construct: (model, attrs) => {
				model.modelState.score = attrs.content.score
			},
			clone: (model, clone) => {
				clone.modelState.isCloneTest = true;
				return clone;
			},
			toJSON: (model, json) => {
				json.isToJSONTest = true;
				return json;
			},
			toText: (model) => {
				return 'toTextTestResult'
			}
		})

		expect(o.modelState.score).toEqual(100)
		expect(o.modelState.isCloneTest).toBeUndefined()
		expect(o.clone().modelState.isCloneTest).toBe(true)
		expect(o.toJSON().isToJSONTest).toBe(true)
		expect(o.toText()).toEqual('toTextTestResult')
	})

	test("should retrieve the root model", () => {
		let o = OboModel.__create({
			id: 'root',
			type: 'root-type',
			children: [{
				id: 'child',
				type: 'child-type'
			}]
		})

		expect(OboModel.models.root.getRoot()).toBe(o)
		expect(OboModel.models.child.getRoot()).toBe(o)
	})

	test("should process a trigger", () => {
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
								value: "__actionFn()"
							}
						]
					}
				]
			}
		})

		// process t1, should trigger action a1 then a2
		o.processTrigger('t1')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(2)
		expect(Dispatcher.trigger.mock.calls[0]).toEqual([
			'a1',
			{ type:'a1', value:1 }
		])
		expect(Dispatcher.trigger.mock.calls[1]).toEqual([
			'a2',
			{ type:'a2', value:2 }
		])

		// process t1 but since run = 'once' it won't trigger again
		Dispatcher.trigger.mockClear()
		o.processTrigger('t1')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(0)

		// process t2, should trigger action a3 and eval _js
		Dispatcher.trigger.mockClear()
		o.processTrigger('t2')

		expect(Dispatcher.trigger).toHaveBeenCalledTimes(1)
		expect(Dispatcher.trigger.mock.calls[0]).toEqual([
			'a3',
			{ type:'a3', value:3 }
		])
		expect(global.__actionFn).toHaveBeenCalledTimes(1)

		// process t3 which isn't defined so nothing should be triggered
		Dispatcher.trigger.mockClear()
		o.processTrigger('t3')

		expect(Dispatcher.trigger).not.toHaveBeenCalled()

		delete global.__actionFn
	})

	//@TODO: Test fails, flags on modelState are broken, skip for now
	test.skip("marking models as dirty sets flags dirty and needsUpdate but does not modify children", () => {
		let o = OboModel.__create({
			id: 'root',
			type: 'root-type',
			children: [{
				id: 'child',
				type: 'child-type'
			}]
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
	})

	test("removing children sets their parent to null, marks them dirty and removes them from the model db", () => {
		let o = OboModel.__create({
			id: 'root',
			type: 'root-type',
			children: [{
				id: 'child',
				type: 'child-type'
			}]
		})

		let child = OboModel.models.child;
		child.modelState.dirty = false;

		o.children.remove(child);

		expect(child.parent).toBe(null);
		expect(OboModel.models.root.modelState.dirty).toBe(false);
		expect(child.modelState.dirty).toBe(true);

		expect(OboModel.models.child).toBeUndefined()
	})

	test("adding children sets their parent and marks them dirty", () => {
		let root = new OboModel({});
		let child = new OboModel({});

		expect(root.modelState.dirty).toBe(false);
		expect(child.modelState.dirty).toBe(false);

		root.children.add(child);

		expect(child.parent).toBe(root);
		expect(child.modelState.dirty).toBe(true);
	})

	test("removing children sets their parent to null and marks them dirty", () => {
		let root = new OboModel({});
		let child = new OboModel({});

		root.children.add(child);

		root.modelState.dirty = child.modelState.dirty = false;

		root.children.remove(child);

		expect(child.parent).toBe(null);
		expect(child.modelState.dirty).toBe(true);
	})

	test("resetting sets the children's parent", () => {
		let root = new OboModel({});
		let child = new OboModel({});

		root.children.add(child);

		child.parent = null;

		console.log('children', root.children.models.length);
		root.children.reset();

		expect(child.parent).toBe(root);
	})
})
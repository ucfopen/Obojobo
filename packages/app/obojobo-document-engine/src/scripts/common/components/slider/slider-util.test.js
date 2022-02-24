import SliderUtils from './slider-utils'

describe('Slider Update Mode', () => {
	test('mode4 updates the handle positions', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 5 }]
		const next = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 6 }]

		expect(SliderUtils.mode4(curr, next, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 6,
		  },
		]
	`)
	})

	test('mode4 deals with pushing handles forward', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const next = [{ key: 'key-1', val: 3 }, { key: 'key-2', val: 2 }]

		expect(SliderUtils.mode4(curr, next, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 3,
		  },
		  Object {
		    "key": "key-2",
		    "val": 3,
		  },
		]
	`)
	})

	test('mode4 deals with pushing handles backwards', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const next = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 1 }]

		expect(SliderUtils.mode4(curr, next, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 1,
		  },
		  Object {
		    "key": "key-2",
		    "val": 1,
		  },
		]
	`)
	})

	test('mode4 deals with out of order keys', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const next = [{ key: 'key-2', val: 2 }, { key: 'key-1', val: 1 }]

		expect(SliderUtils.mode4(curr, next, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 1,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
	})

	test('mode4 deals with no move', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const next = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]

		expect(SliderUtils.mode4(curr, next, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
	})

	test('mode4 deals with invalid values', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const nextbackward = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 1 }]
		const nextforwards = [{ key: 'key-1', val: 3 }, { key: 'key-2', val: 2 }]

		expect(SliderUtils.mode4(curr, nextbackward, 1, false, () => 4)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
		expect(SliderUtils.mode4(curr, nextforwards, 1, false, () => 4)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
	})

	test('mode4 deals with failed check', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]
		const nextbackward = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 1 }]
		const nextforwards = [{ key: 'key-1', val: 3 }, { key: 'key-2', val: 2 }]

		const spy = jest.spyOn(SliderUtils, 'getUpdatedHandles')
		spy.mockReturnValueOnce(nextbackward).mockReturnValueOnce(nextforwards)

		expect(SliderUtils.mode4(curr, nextbackward, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
		expect(SliderUtils.mode4(curr, nextforwards, 1, false, val => val)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "key-1",
		    "val": 2,
		  },
		  Object {
		    "key": "key-2",
		    "val": 2,
		  },
		]
	`)
	})

	test('getUpdatedHandles returns handles when there is no matching key', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]

		expect(SliderUtils.getUpdatedHandles(curr, 'key-3', 3, false)).toEqual(curr)
	})

	test('getUpdatedHandles returns handles when the value is already present', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 2 }]

		expect(SliderUtils.getUpdatedHandles(curr, 'key-2', 2, false)).toEqual(curr)
	})

	test('getSortByVals sorts in order', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 1 }, { key: 'key-3', val: 3 }]

		expect(curr.sort(SliderUtils.getSortByVal(false))).toEqual([
			{ key: 'key-2', val: 1 },
			{ key: 'key-1', val: 2 },
			{ key: 'key-3', val: 3 }
		])
	})

	test('getSortByVals sorts reversed', () => {
		const curr = [{ key: 'key-1', val: 2 }, { key: 'key-2', val: 1 }, { key: 'key-3', val: 3 }]

		expect(curr.sort(SliderUtils.getSortByVal(true))).toEqual([
			{ key: 'key-3', val: 3 },
			{ key: 'key-1', val: 2 },
			{ key: 'key-2', val: 1 }
		])
	})
})

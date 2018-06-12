import StyleableText from '../../../src/scripts/common/text/styleable-text'
import StyleRange from '../../../src/scripts/common/text/style-range'
import TextGroup from '../../../src/scripts/common/text-group/text-group'
import TextGroupItem from '../../../src/scripts/common/text-group/text-group-item'

describe('TextGroup', () => {
	let tg, tg3items, tgDataTemplate, tgWithItems, tgWith3Items, frozenEmptyObject

	beforeEach(() => {
		tg = new TextGroup()
		tg3items = new TextGroup(3)
		tgDataTemplate = new TextGroup(Infinity, { a: 1, b: 2 })
		tgWithItems = new TextGroup(Infinity, {}, [
			new TextGroupItem(new StyleableText('first'), { a: 1 }),
			new TextGroupItem(new StyleableText('second'), { b: 1 })
		])
		tgWith3Items = new TextGroup(Infinity, {}, [
			new TextGroupItem(new StyleableText('first')),
			new TextGroupItem(new StyleableText('second')),
			new TextGroupItem(new StyleableText('third'))
		])

		frozenEmptyObject = Object.freeze({})
	})

	test('constructor creates instances with expected values', () => {
		expect(tg.maxItems).toBe(Infinity)
		expect(tg.items.length).toBe(0)
		expect(tg.dataTemplate).toEqual(frozenEmptyObject)

		expect(tg3items.maxItems).toBe(3)
		expect(tg3items.items.length).toBe(0)
		expect(tg3items.dataTemplate).toEqual(frozenEmptyObject)

		expect(tgDataTemplate.maxItems).toBe(Infinity)
		expect(tgDataTemplate.items.length).toBe(0)
		expect(tgDataTemplate.dataTemplate).toEqual(Object.freeze({ a: 1, b: 2 }))

		expect(tgWithItems.maxItems).toBe(Infinity)
		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.dataTemplate).toEqual(frozenEmptyObject)
	})

	test('clear removes items', () => {
		tgWithItems.clear()

		expect(tgWithItems.maxItems).toBe(Infinity)
		expect(tgWithItems.items.length).toBe(0)
		expect(tgWithItems.dataTemplate).toEqual(frozenEmptyObject)
	})

	test('indexOf returns the index of an item', () => {
		tg.add(new StyleableText('test'))

		expect(tg.indexOf(tg.first)).toBe(0)
	})

	test('init builds the text group with items', () => {
		tgWithItems.init(10)

		tgWithItems.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText())
			expect(item.data).toEqual({})
		})

		expect(tgWithItems.items.length).toBe(10)
	})

	test('init builds the text group with items while respecting the max items limit', () => {
		tg3items.init(10)

		tg3items.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText())
			expect(item.data).toEqual({})
		})

		expect(tg3items.items.length).toBe(3)
	})

	test('init builds the text group with 1 item if number not specified', () => {
		tgWithItems.init()

		tgWithItems.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText())
			expect(item.data).toEqual({})
		})

		expect(tgWithItems.items.length).toBe(1)
	})

	test('fill adds items to the max item limit', () => {
		tg3items.fill()

		tg3items.items.map(function(item) {
			expect(item.text).toEqual(new StyleableText())
			expect(item.data).toEqual({})
		})

		expect(tg3items.items.length).toBe(3)
	})

	test("fill doesn't fill items with no max item limit", () => {
		tg.fill()

		expect(tg.items.length).toBe(0)
	})

	test('add inserts a new item', () => {
		tg.add(new StyleableText('test'))

		expect(tg.length).toBe(1)
	})

	test('add does not insert a new item if full', () => {
		tg3items.fill()

		expect(tg3items.length).toBe(3)

		tg3items.add(new StyleableText('test'))

		expect(tg3items.length).toBe(3)
	})

	test('add builds items while respecting data template', () => {
		tg.add(new StyleableText('new item'), { x: 0 })

		expect(tg.items.length).toBe(1)
		expect(tg.first.text).toEqual(new StyleableText('new item'))
		expect(tg.first.data).toEqual({})

		tgDataTemplate.add(new StyleableText('new item'), { a: 100, c: 200 })

		expect(tgDataTemplate.items.length).toBe(1)
		expect(tgDataTemplate.first.text).toEqual(new StyleableText('new item'))
		expect(tgDataTemplate.first.data).toEqual({ a: 100, b: 2 })
	})

	test('addAt adds item at a specified index', () => {
		tgWithItems.addAt(0, new StyleableText('new'))

		expect(tgWithItems.items.length).toBe(3)
		expect(tgWithItems.first.text).toEqual(new StyleableText('new'))
		expect(tgWithItems.first.data).toEqual({})
	})

	test('addAt does not add item at a specified index when full', () => {
		tg3items.fill()

		expect(tg3items.length).toBe(3)

		tg3items.addAt(0, new StyleableText('new'))

		expect(tg3items.length).toBe(3)
	})

	test('addGroup adds a group', () => {
		tg.add(new StyleableText('A'))
		tg.add(new StyleableText('B'))

		tg.addGroup(tgWithItems)

		expect(tg.items.length).toBe(4)
		expect(tg.items[0].text).toEqual(new StyleableText('A'))
		expect(tg.items[1].text).toEqual(new StyleableText('B'))
		expect(tg.items[2].text).toEqual(new StyleableText('first'))
		expect(tg.items[3].text).toEqual(new StyleableText('second'))
	})

	test('addGroup adds a group at a specified index', () => {
		tg.add(new StyleableText('A'))
		tg.add(new StyleableText('B'))

		tg.addGroupAt(tgWithItems, 1)

		expect(tg.items.length).toBe(4)
		expect(tg.items[0].text).toEqual(new StyleableText('A'))
		expect(tg.items[1].text).toEqual(new StyleableText('first'))
		expect(tg.items[2].text).toEqual(new StyleableText('second'))
		expect(tg.items[3].text).toEqual(new StyleableText('B'))
	})

	test('addGroup adds a group with custom clone data function', () => {
		tg.dataTemplate = { a: 1, b: 2, x: 3 }
		tg.add(new StyleableText('A'))
		tg.add(new StyleableText('B'))

		tg.addGroup(tgWithItems, function(data) {
			data.x = 1000
			data.z = 2000

			return data
		})

		expect(tg.items[2].data).toEqual({ a: 1, b: 2, x: 1000 })
	})

	test('addGroupAt adds a group and maintains data template', () => {
		tg.dataTemplate = { a: 1, b: 2, x: 3 }
		tg.add(new StyleableText('A'))
		tg.add(new StyleableText('B'), { a: 100, c: 200, x: 300 })

		expect(tg.items[1].data).toEqual({ a: 100, b: 2, x: 300 })

		tgDataTemplate.addGroupAt(tg)

		expect(tgDataTemplate.items.length).toBe(2)
		expect(tgDataTemplate.items[0].data).toEqual({ a: 1, b: 2 })
		expect(tgDataTemplate.items[1].data).toEqual({ a: 100, b: 2 })
	})

	test('get retrieves an item at a specified index', () => {
		expect(tgWithItems.get(0)).toEqual(tgWithItems.items[0])
	})

	test('set places an item at a specified index', () => {
		tgWithItems.set(0, new StyleableText('new'))

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('new'))
	})

	test('remove deletes an item at a specified index', () => {
		tgWithItems.remove(0)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('second'))
	})

	test('remove sets item index to -1', () => {
		let firstItem = tgWithItems.get(0)

		expect(firstItem.index).toBe(0)

		let removed = tgWithItems.remove(0)

		expect(firstItem).toBe(removed)
		expect(firstItem.index).toBe(-1)
	})

	test('clone creates a copy', () => {
		let clone = tgWithItems.clone()

		expect(clone).not.toBe(tgWithItems)
		expect(clone.items.length).toBe(tgWithItems.items.length)
		expect(clone.maxItems).toBe(tgWithItems.maxItems)
		expect(clone.dataTemplate).toEqual(tgWithItems.dataTemplate)
		expect(clone.dataTemplate).not.toBe(tgWithItems.dataTemplate)

		expect(clone.items[0].text).toEqual(tgWithItems.items[0].text)
		expect(clone.items[1].text).toEqual(tgWithItems.items[1].text)
		expect(clone.items[0].data).toEqual(tgWithItems.items[0].data)
		expect(clone.items[1].data).toEqual(tgWithItems.items[1].data)
	})

	test('clone creates a copy with a custom clone function', () => {
		tgDataTemplate.add(new StyleableText('new1'), { a: 100 })
		tgDataTemplate.add(new StyleableText('new2'), { b: 100 })

		let clone = tgDataTemplate.clone(function(data) {
			data.b = 5
			return data
		})

		expect(clone.items.length).toBe(2)
		expect(clone.items[0].text).toEqual(new StyleableText('new1'))
		expect(clone.items[1].text).toEqual(new StyleableText('new2'))
		expect(clone.items[0].data).toEqual({ a: 100, b: 5 })
		expect(clone.items[1].data).toEqual({ a: 1, b: 5 })
	})

	test('toDescriptor exports to an object', () => {
		expect(tgWithItems.toDescriptor()).toEqual([
			{
				text: {
					value: 'first',
					styleList: null
				},
				data: {}
			},
			{
				text: {
					value: 'second',
					styleList: null
				},
				data: {}
			}
		])
	})

	test('toSlice reduces to a subset', () => {
		tgWithItems.toSlice(0, 1)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
	})

	test('toSlice slices to end without second param', () => {
		tgWithItems.toSlice(1)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('second'))
	})

	test('splitBefore splits itself into two groups', () => {
		tg.add(new StyleableText('A'))
		tg.add(new StyleableText('B'))
		tg.add(new StyleableText('C'))

		let a = tg.clone()
		let sibling = a.splitBefore(1)

		expect(a.items.length).toBe(1)
		expect(sibling.items.length).toBe(2)
		expect(a.items[0].text).toEqual(new StyleableText('A'))
		expect(sibling.items[0].text).toEqual(new StyleableText('B'))
		expect(sibling.items[1].text).toEqual(new StyleableText('C'))

		let b = tg.clone()
		sibling = b.splitBefore(0)
		expect(b.items.length).toBe(0)
		expect(sibling.items.length).toBe(3)
		expect(sibling.items[0].text).toEqual(new StyleableText('A'))
		expect(sibling.items[1].text).toEqual(new StyleableText('B'))
		expect(sibling.items[2].text).toEqual(new StyleableText('C'))

		let c = tg.clone()
		sibling = c.splitBefore(3)
		expect(c.items.length).toBe(3)
		expect(sibling.items.length).toBe(0)
		expect(c.items[0].text).toEqual(new StyleableText('A'))
		expect(c.items[1].text).toEqual(new StyleableText('B'))
		expect(c.items[2].text).toEqual(new StyleableText('C'))
	})

	test('splitText splits at the start of the group', () => {
		tgWithItems.splitText(0, 0)

		expect(tgWithItems.items.length).toBe(3)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[2].text).toEqual(new StyleableText('second'))
	})

	test('splitText splits in the middle of the group', () => {
		tgWithItems.splitText(0, 2)

		expect(tgWithItems.items.length).toBe(3)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('fi'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('rst'))
		expect(tgWithItems.items[2].text).toEqual(new StyleableText('second'))
	})

	test('splitText splits at the end of the group', () => {
		tgWithItems.splitText(1, 6)

		expect(tgWithItems.items.length).toBe(3)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
		expect(tgWithItems.items[2].text).toEqual(new StyleableText(''))
	})

	test('splitText clones data', () => {
		tgDataTemplate.add(new StyleableText('first'), { a: 100 })
		tgDataTemplate.add(new StyleableText('second'), { b: 200 })

		tgDataTemplate.splitText(0, 2)

		expect(tgDataTemplate.items.length).toBe(3)
		expect(tgDataTemplate.items[0].data).toEqual({ a: 100, b: 2 })
		expect(tgDataTemplate.items[1].data).toEqual({ a: 100, b: 2 })
		expect(tgDataTemplate.items[2].data).toEqual({ a: 1, b: 200 })
	})

	test('merge combines text', () => {
		tgDataTemplate.add(new StyleableText('my'), { a: 'my', b: 100 })
		tgDataTemplate.add(new StyleableText('hot'), { a: 'hot', b: 200 })
		tgDataTemplate.add(new StyleableText('dog'), { a: 'dog', b: 300 })
		tgDataTemplate.add(new StyleableText('is tasty'), { a: 'is tasty', b: 400 })

		tgDataTemplate.merge(1)

		expect(tgDataTemplate.items.length).toBe(3)
		expect(tgDataTemplate.items[0].text).toEqual(new StyleableText('my'))
		expect(tgDataTemplate.items[1].text).toEqual(new StyleableText('hotdog'))
		expect(tgDataTemplate.items[2].text).toEqual(new StyleableText('is tasty'))

		expect(tgDataTemplate.items[0].data).toEqual({ a: 'my', b: 100 })
		expect(tgDataTemplate.items[1].data).toEqual({ a: 'hot', b: 200 })
		expect(tgDataTemplate.items[2].data).toEqual({ a: 'is tasty', b: 400 })
	})

	test('merge does not combine text outside of bounds', () => {
		tgDataTemplate.add(new StyleableText('my'), { a: 'my', b: 100 })
		tgDataTemplate.add(new StyleableText('hot'), { a: 'hot', b: 200 })
		tgDataTemplate.add(new StyleableText('dog'), { a: 'dog', b: 300 })
		tgDataTemplate.add(new StyleableText('is tasty'), { a: 'is tasty', b: 400 })

		tgDataTemplate.merge(8)

		expect(tgDataTemplate.items.length).toBe(4)
		expect(tgDataTemplate.items[0].text).toEqual(new StyleableText('my'))
		expect(tgDataTemplate.items[1].text).toEqual(new StyleableText('hot'))
		expect(tgDataTemplate.items[2].text).toEqual(new StyleableText('dog'))
		expect(tgDataTemplate.items[3].text).toEqual(new StyleableText('is tasty'))
	})

	test('merge combines text with a custom merge function', () => {
		tgDataTemplate.add(new StyleableText('abc'), { b: 100 })
		tgDataTemplate.add(new StyleableText('xyz'), { b: 200 })

		tgDataTemplate.merge(0, function(consumer, digested) {
			consumer.b += digested.b
			return consumer
		})

		expect(tgDataTemplate.items[0].data).toEqual({ a: 1, b: 300 })
	})

	test('deleteSpan deletes a span of text', () => {
		tgWithItems.deleteSpan(0, 1, 0, 2)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('frst'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('deleteSpan deletes a span of text at the start of the first item', () => {
		tgWithItems.deleteSpan(0, 0, 0, 1)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('irst'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('deleteSpan deletes a span of text at the end of the first item', () => {
		tgWithItems.deleteSpan(0, 4, 0, 5)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('firs'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('deleteSpan deletes the complete span of the first text item', () => {
		tgWithItems.deleteSpan(0, 0, 0, 5)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('deleteSpan deletes a span of text at the start of the last item', () => {
		tgWithItems.deleteSpan(1, 0, 1, 1)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('econd'))
	})

	test('deleteSpan deletes a span of text at the end of the last item', () => {
		tgWithItems.deleteSpan(1, 5, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('secon'))
	})

	test('deleteSpan deletes the complete span of the last text item', () => {
		tgWithItems.deleteSpan(1, 0, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(''))
	})

	test('deleteSpan deletes a span of text that covers two text items', () => {
		tgWithItems.deleteSpan(0, 1, 1, 5)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('fd'))
	})

	test("deleteSpan deletes a span of text that covers two text items but doesn't merge when specified not to merge", () => {
		tgWithItems.deleteSpan(0, 1, 1, 5, false)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('f'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('d'))
	})

	test('deleteSpan deletes a span of text that covers three text items', () => {
		tgWith3Items.deleteSpan(0, 1, 2, 4)

		expect(tgWith3Items.items.length).toBe(1)
		expect(tgWith3Items.items[0].text).toEqual(new StyleableText('fd'))
	})

	test('deleteSpan deletes a span of text that covers two middle items', () => {
		tgWith3Items.add(new StyleableText('fourth'))
		tgWith3Items.deleteSpan(1, 1, 2, 4)

		expect(tgWith3Items.items.length).toBe(3)
		expect(tgWith3Items.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWith3Items.items[1].text).toEqual(new StyleableText('sd'))
		expect(tgWith3Items.items[2].text).toEqual(new StyleableText('fourth'))
	})

	test('deleteSpan deletes a span of text from the beginning to inside the last text item', () => {
		tgWithItems.deleteSpan(0, 0, 1, 5)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('d'))
	})

	test('deleteSpan deletes a span of text from inside the first text item to the end', () => {
		tgWithItems.deleteSpan(0, 1, 1, 6)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('f'))
	})

	test('deleteSpan deletes all the text', () => {
		tgWithItems.deleteSpan(0, 0, 1, 6)

		expect(tgWithItems.items.length).toBe(1)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
	})

	test('deleteSpan deletes a span of text and merges data', () => {
		tgDataTemplate.add(new StyleableText('first'), { a: 100 })
		tgDataTemplate.add(new StyleableText('second'), { b: 200 })

		tgDataTemplate.deleteSpan(0, 1, 1, 5)

		expect(tgDataTemplate.items.length).toBe(1)
		expect(tgDataTemplate.items[0].data).toEqual({ a: 100, b: 2 })
	})

	test('deleteSpan deletes a span of text and merges data with a custom merge function', () => {
		tgDataTemplate.add(new StyleableText('first'), { a: 100 })
		tgDataTemplate.add(new StyleableText('second'), { b: 200 })

		tgDataTemplate.deleteSpan(0, 1, 1, 5, true, function(consumer, digested) {
			consumer.a += digested.a
			return consumer
		})

		expect(tgDataTemplate.items.length).toBe(1)
		expect(tgDataTemplate.items[0].data).toEqual({ a: 101, b: 2 })
	})

	test('clearSpan clears a span of text', () => {
		tgWithItems.clearSpan(0, 1, 0, 2)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('frst'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('clearSpan clears a span of text at the start of the first item', () => {
		tgWithItems.clearSpan(0, 0, 0, 1)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('irst'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('clearSpan clears a span of text at the end of the first item', () => {
		tgWithItems.clearSpan(0, 4, 0, 5)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('firs'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('clearSpan clears the complete span of the first text item', () => {
		tgWithItems.clearSpan(0, 0, 0, 5)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('second'))
	})

	test('clearSpan clears a span of text at the start of the last item', () => {
		tgWithItems.clearSpan(1, 0, 1, 1)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('econd'))
	})

	test('clearSpan clears a span of text at the end of the last item', () => {
		tgWithItems.clearSpan(1, 5, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('secon'))
	})

	test('clearSpan clears the complete span of the last text item', () => {
		tgWithItems.clearSpan(1, 0, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('first'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(''))
	})

	test('clearSpan clears a span of text that covers two text items', () => {
		tgWithItems.clearSpan(0, 1, 1, 5, false)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('f'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('d'))
	})

	test('clears a span of text that covers three text items', () => {
		tgWith3Items.clearSpan(0, 1, 2, 4, false)

		expect(tgWith3Items.items.length).toBe(3)
		expect(tgWith3Items.items[0].text).toEqual(new StyleableText('f'))
		expect(tgWith3Items.items[1].text).toEqual(new StyleableText(''))
		expect(tgWith3Items.items[2].text).toEqual(new StyleableText('d'))
	})

	test('clearSpan clears a span of text from the beginning to inside the last text item', () => {
		tgWithItems.clearSpan(0, 0, 1, 5)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText('d'))
	})

	test('clearSpan clears a span of text from inside the first text item to the end', () => {
		tgWithItems.clearSpan(0, 1, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText('f'))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(''))
	})

	test('clearSpan clears all the text', () => {
		tgWithItems.clearSpan(0, 0, 1, 6)

		expect(tgWithItems.items.length).toBe(2)
		expect(tgWithItems.items[0].text).toEqual(new StyleableText(''))
		expect(tgWithItems.items[1].text).toEqual(new StyleableText(''))
	})

	test('styleText styles text at the beginning of the group', () => {
		tgWith3Items.styleText(0, 0, 0, 1, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(1)
		expect(styles2.length).toBe(0)
		expect(styles3.length).toBe(0)
		expect(styles1[0]).toEqual(new StyleRange(0, 1, 'b'))
	})

	test('styleText styles text at the end of the group', () => {
		tgWith3Items.styleText(2, 4, 2, 5, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(0)
		expect(styles3.length).toBe(1)
		expect(styles3[0]).toEqual(new StyleRange(4, 5, 'b'))
	})

	test('styleText styles text spanning two text items', () => {
		tgWith3Items.styleText(0, 1, 1, 1, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(1)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(0)
		expect(styles1[0]).toEqual(new StyleRange(1, 5, 'b'))
		expect(styles2[0]).toEqual(new StyleRange(0, 1, 'b'))
	})

	test('styleText styles all text', () => {
		tgWith3Items.styleText(0, 0, 2, 5, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(1)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(1)
		expect(styles1[0]).toEqual(new StyleRange(0, 5, 'b'))
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'))
		expect(styles3[0]).toEqual(new StyleRange(0, 5, 'b'))
	})

	test('styleText does not style if range is backwards', () => {
		tgWith3Items.styleText(2, 1, 1, 1, 'i')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(0)
	})

	test('unstyleText unstyles a span of text', () => {
		tgWith3Items.styleText(0, 0, 2, 5, 'b')
		tgWith3Items.unstyleText(0, 0, 0, 1, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(1)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(1)
		expect(styles1[0]).toEqual(new StyleRange(1, 5, 'b'))
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'))
		expect(styles3[0]).toEqual(new StyleRange(0, 5, 'b'))
	})

	test('toggleStyleText will style a portion of un-styled text', () => {
		tgWith3Items.toggleStyleText(1, 1, 1, 5, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(0)
		expect(styles2[0]).toEqual(new StyleRange(1, 5, 'b'))
	})

	test('toggleStyleText will style a portion of partially styled text', () => {
		tgWith3Items.styleText(1, 1, 1, 5, 'b')
		tgWith3Items.toggleStyleText(1, 0, 1, 6, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(0)
		expect(styles2[0]).toEqual(new StyleRange(0, 6, 'b'))
	})

	test('toggleStyleText will un-style a portion of styled text', () => {
		tgWith3Items.styleText(1, 1, 1, 5, 'b')
		tgWith3Items.toggleStyleText(1, 2, 1, 5, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(1)
		expect(styles3.length).toBe(0)
		expect(styles2[0]).toEqual(new StyleRange(1, 2, 'b'))
	})

	test('toggleStyleText will un-style the portion of styled text', () => {
		tgWith3Items.styleText(1, 1, 1, 5, 'b')
		tgWith3Items.toggleStyleText(1, 1, 1, 5, 'b')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		expect(styles1.length).toBe(0)
		expect(styles2.length).toBe(0)
		expect(styles3.length).toBe(0)
	})

	test('getStyles will return only the styles covered by the span', () => {
		tgWith3Items.styleText(1, 1, 1, 5, 'b')
		tgWith3Items.styleText(1, 0, 1, 6, 'i')
		let styles1 = tgWith3Items.items[0].text.styleList.styles
		let styles2 = tgWith3Items.items[1].text.styleList.styles
		let styles3 = tgWith3Items.items[2].text.styleList.styles

		let styles = tgWith3Items.getStyles(1, 1, 1, 5)
		expect(styles.i).toBe('i')
		expect(styles.b).toBe('b')

		styles = tgWith3Items.getStyles(1, 0, 1, 5)
		expect(styles.i).toBe('i')
		expect(styles.b).not.toBeDefined()
	})

	test('getStyles works over multiple items', () => {
		tgWith3Items.styleText(0, 1, 2, 1, 'b')

		let styles = tgWith3Items.getStyles(0, 0, 2, 1)
		expect(styles).toEqual({})

		styles = tgWith3Items.getStyles(1, 0, 1, 5)
		expect(styles).toEqual({ b: 'b' })
	})

	test('getStyles returns empty if given incorrect params', () => {
		tgWith3Items.styleText(0, 1, 2, 1, 'b')

		let styles = tgWith3Items.getStyles(72, 83, 2, 1)
		expect(styles).toEqual({})
	})

	test('getStyles returns nothing if first item does not have text', () => {
		tgWith3Items.styleText(0, 1, 2, 1, 'b')
		tgWith3Items.items[3] = {}

		let styles = tgWith3Items.getStyles(3, 0, 2, 1)
		expect(styles).toEqual({})
	})

	test('getStyles returns styles if found', () => {
		tgWith3Items.styleText(0, 1, 2, 1, 'b')
		tgWith3Items.add({})

		let styles = tgWith3Items.getStyles(3, 0, 2, 1)
		expect(styles).toEqual({ b: 'b' })
	})

	test('length returns the length', () => {
		expect(tgWithItems.length).toBe(tgWithItems.items.length)
	})

	test('first returns the first item', () => {
		expect(tgWithItems.first).toBe(tgWithItems.items[0])
	})

	test('last returns the last item', () => {
		expect(tgWithItems.last).toBe(tgWithItems.items[tgWithItems.items.length - 1])
	})

	test('isFull can respond if it is full', () => {
		expect(tg3items.isFull).toBe(false)
		tg3items.add(new StyleableText('item'))
		expect(tg3items.isFull).toBe(false)
		tg3items.add(new StyleableText('item'))
		expect(tg3items.isFull).toBe(false)
		tg3items.add(new StyleableText('item'))
		expect(tg3items.isFull).toBe(true)
	})

	test('isEmpty can respond if it is empty or blank', () => {
		expect(tgWithItems.isEmpty).toBe(false)

		tgWithItems.remove(0)

		expect(tgWithItems.isEmpty).toBe(false)

		tgWithItems.first.text.init()

		expect(tgWithItems.isEmpty).toBe(false)

		tgWithItems.remove(0)

		expect(tgWithItems.isEmpty).toBe(true)
	})

	test('isBlank can respond if it is blank', () => {
		expect(tgWithItems.isBlank).toBe(false)

		tgWithItems.remove(0)

		expect(tgWithItems.isBlank).toBe(false)

		tgWithItems.first.text.init()

		expect(tgWithItems.isBlank).toBe(true)

		tgWithItems.remove(0)

		expect(tgWithItems.isBlank).toBe(true)
	})

	test('fromDescriptor can create an instance from an object', () => {
		tgDataTemplate.add('first', { a: 1, c: 1 })
		tgDataTemplate.add('second', { a: 2, c: 2 })

		let o = tgWithItems.toDescriptor()
		let newTg = TextGroup.fromDescriptor(o, 10, { b: 2 })

		expect(newTg.maxItems).toBe(10)
		expect(newTg.items.length).toBe(2)
		expect(newTg.items[0].text).toEqual(new StyleableText('first'))
		expect(newTg.items[1].text).toEqual(new StyleableText('second'))
		expect(newTg.items[0].data).toEqual({ b: 2 })
		expect(newTg.items[1].data).toEqual({ b: 2 })
	})

	test('fromDescriptor can create an instance from an object with a custom function', () => {
		let mockMethod = jest.fn()
		tgDataTemplate.add('first', { a: 1, c: 1 })
		tgDataTemplate.add('second', { a: 2, c: 2 })

		let o = tgWithItems.toDescriptor()
		let newTg = TextGroup.fromDescriptor(o, 10, { b: 2 }, mockMethod)

		expect(newTg.maxItems).toBe(10)
		expect(newTg.items.length).toBe(2)
		expect(newTg.items[0].text).toEqual(new StyleableText('first'))
		expect(newTg.items[1].text).toEqual(new StyleableText('second'))
		expect(newTg.items[0].data).toEqual({ b: 2 })
		expect(newTg.items[1].data).toEqual({ b: 2 })
	})

	test('create builds an instance', () => {
		let newTg = TextGroup.create(10, { x: 1 }, 4)
		newTg.addAt(0, new StyleableText('first'), { x: 2, y: 1 })

		expect(newTg.maxItems).toBe(10)
		expect(newTg.items.length).toBe(5)
		expect(newTg.items[0].text).toEqual(new StyleableText('first'))
		expect(newTg.items[1].text).toEqual(new StyleableText(''))
		expect(newTg.items[2].text).toEqual(new StyleableText(''))
		expect(newTg.items[3].text).toEqual(new StyleableText(''))
		expect(newTg.items[4].text).toEqual(new StyleableText(''))
		expect(newTg.items[0].data).toEqual({ x: 2 })
		expect(newTg.items[1].data).toEqual({ x: 1 })
		expect(newTg.items[2].data).toEqual({ x: 1 })
		expect(newTg.items[3].data).toEqual({ x: 1 })
		expect(newTg.items[4].data).toEqual({ x: 1 })
	})

	test('create builds an instance without attributes', () => {
		let newTg = TextGroup.create()

		expect(newTg.maxItems).toBe(Infinity)
		expect(newTg.items.length).toBe(1)
		expect(newTg.items[0].text).toEqual(new StyleableText(''))
	})
})

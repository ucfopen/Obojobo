import DOMUtil from '../../../src/scripts/common/page/dom-util'

describe('DOMUtil', () => {
	const exampleHTML = `
		<div id="obo-a" class="component" data-obo-component data-id="a" data-type="t-a">
			<div id="obo-b" data-x="yes">
				<span id="obo-c">First text</span>
				<div id="obo-d" class="component" data-obo-component data-id="d" data-type="t-d">
					<ul id="obo-e">
						<li id="obo-f">
							<div id="obo-g" class="component" data-obo-component data-id="g" data-type="t-g">
								Second text with some line breaks and <b>bolded <i>italic</i> content</b> inside
							</div>
						</li>
					</ul>
				</div>
				<div id="obo-h" class="component" data-obo-component data-id="h" data-type="t-h">
					<span id="obo-i">Third text</span>
				</div>
			</div>
			<div id="obo-j" data-obo-component>Not quite a real obo component</div>
			<div id="obo-k" data-nest="true">
				<div>
					<div data-obo-component>
						<p id="obo-l">A deeply nested item</p>
					</div>
				</div>
			</div>
		</div>
	`.replace(/[\t\n]/g, '')
	const root = document.createElement('div')

	root.innerHTML = exampleHTML
	document.body.appendChild(root)

	test('finds parent elements with a given attribute', () => {
		const g = document.getElementById('obo-g')
		const target = DOMUtil.findParentWithAttr(g, 'data-x')

		expect(target).toBe(document.getElementById('obo-b'))
	})

	test('finds parent elements with a given attribute', () => {
		const l = {}
		const target = DOMUtil.findParentWithAttr(l, 'data-nest')

		expect(target).toBe(null)
	})

	test('finds parent elements with a given value', () => {
		const g = document.getElementById('obo-g')
		const target = DOMUtil.findParentWithAttr(g, 'data-x', 'yes')

		expect(target).toBe(document.getElementById('obo-b'))
	})

	test("doesn't find parent with a non-matching attribute", () => {
		const g = document.getElementById('obo-g')
		const target = DOMUtil.findParentWithAttr(g, 'data-y')

		expect(target).toBe(null)
	})

	test("doesn't find parent with a non-matching value", () => {
		const g = document.getElementById('obo-g')
		const target = DOMUtil.findParentWithAttr(g, 'data-x', 'no')

		expect(target).toBe(null)
	})

	test('finds parent elements when rootParent specified', () => {
		const g = document.getElementById('obo-g')
		const target = DOMUtil.findParentWithAttr(g, 'data-x', null, root)

		expect(target).toBe(document.getElementById('obo-b'))
	})

	test("doesn't find parent with no matches inside the rootParent", () => {
		const g = document.getElementById('obo-g')
		const d = document.getElementById('obo-d')
		const target = DOMUtil.findParentWithAttr(g, 'data-x', null, d)

		expect(target).toBe(null)
	})

	test('finds parent attribute value', () => {
		const g = document.getElementById('obo-g')
		const attr = DOMUtil.findParentAttr(g, 'data-x')

		expect(attr).toBe('yes')
	})

	test("returns null if can't find a parent attribute", () => {
		const g = document.getElementById('obo-g')
		const attr = DOMUtil.findParentAttr(g, 'data-y')

		expect(attr).toBe(null)
	})

	test('finds parent component elements only', () => {
		const a = document.getElementById('obo-a')
		const d = document.getElementById('obo-d')
		const g = document.getElementById('obo-g')
		const l = document.getElementById('obo-l')

		expect([...DOMUtil.findParentComponentElements(g)]).toEqual([g, d, a])
		expect([...DOMUtil.findParentComponentElements(l)]).toEqual([a])
	})

	test('finds parent component elements ids', () => {
		const g = document.getElementById('obo-g')
		const ids = DOMUtil.findParentComponentIds(g)

		expect([...ids]).toEqual(['g', 'd', 'a'])
	})

	test('elementLikeComponent checks an element to verify it seems to be a component', () => {
		const g = document.getElementById('obo-g')
		const j = document.getElementById('obo-j')

		expect(DOMUtil.elementLikeComponent(g)).toBe(true)
		expect(DOMUtil.elementLikeComponent(j)).toBe(false)
	})

	test('gets the first text node of an element', () => {
		const g = document.getElementById('obo-g')

		expect(DOMUtil.getFirstTextNodeOfElement(g).textContent).toBe(
			'Second text with some line breaks and '
		)
	})

	test('gets the text nodes of a document in order', () => {
		const a = document.getElementById('obo-a')
		const textNodeContents = DOMUtil.getTextNodesInOrder(a).map(t => t.textContent)

		expect(textNodeContents).toEqual([
			'First text',
			'Second text with some line breaks and ',
			'bolded ',
			'italic',
			' content',
			' inside',
			'Third text',
			'Not quite a real obo component',
			'A deeply nested item'
		])
	})

	test('getComponentElementById returns the component element for a given obo id', () => {
		const d = document.getElementById('obo-d')
		expect(DOMUtil.getComponentElementById('d')).toBe(d)
	})

	test('getComponentElementById returns null if element not found', () => {
		expect(DOMUtil.getComponentElementById('obo-does-not-exist')).toBe(null)
	})
})

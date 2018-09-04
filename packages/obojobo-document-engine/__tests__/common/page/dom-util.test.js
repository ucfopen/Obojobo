import DOMUtil from '../../../src/scripts/common/page/dom-util'

describe('DOMUtil', () => {
	let exampleHTML = `
		<div id="id-a" class="component" data-obo-component data-id="i-a" data-type="t-a">
			<div id="id-b" data-x="yes">
				<span id="id-c">First text</span>
				<div id="id-d" class="component" data-obo-component data-id="i-d" data-type="t-d">
					<ul id="id-e">
						<li id="id-f">
							<div id="id-g" class="component" data-obo-component data-id="i-g" data-type="t-g">
								Second text with some line breaks and <b>bolded <i>italic</i> content</b> inside
							</div>
						</li>
					</ul>
				</div>
				<div id="id-h" class="component" data-obo-component data-id="i-h" data-type="t-h">
					<span id="id-i">Third text</span>
				</div>
			</div>
			<div id="id-j" data-obo-component>Not quite a real obo component</div>
		</div>
	`.replace(/[\t\n]/g, '')
	let root = document.createElement('div')

	root.innerHTML = exampleHTML
	document.body.appendChild(root)

	test('finds parent elements with a given attribute', () => {
		let g = document.getElementById('id-g')
		let target = DOMUtil.findParentWithAttr(g, 'data-x')

		expect(target).toBe(document.getElementById('id-b'))
	})

	test('finds parent elements with a given value', () => {
		let g = document.getElementById('id-g')
		let target = DOMUtil.findParentWithAttr(g, 'data-x', 'yes')

		expect(target).toBe(document.getElementById('id-b'))
	})

	test("doesn't find parent with a non-matching attribute", () => {
		let g = document.getElementById('id-g')
		let target = DOMUtil.findParentWithAttr(g, 'data-y')

		expect(target).toBe(null)
	})

	test("doesn't find parent with a non-matching value", () => {
		let g = document.getElementById('id-g')
		let target = DOMUtil.findParentWithAttr(g, 'data-x', 'no')

		expect(target).toBe(null)
	})

	test('finds parent elements when rootParent specified', () => {
		let g = document.getElementById('id-g')
		let target = DOMUtil.findParentWithAttr(g, 'data-x', null, root)

		expect(target).toBe(document.getElementById('id-b'))
	})

	test("doesn't find parent with no matches inside the rootParent", () => {
		let g = document.getElementById('id-g')
		let d = document.getElementById('id-d')
		let target = DOMUtil.findParentWithAttr(g, 'data-x', null, d)

		expect(target).toBe(null)
	})

	test('finds parent attribute value', () => {
		let g = document.getElementById('id-g')
		let attr = DOMUtil.findParentAttr(g, 'data-x')

		expect(attr).toBe('yes')
	})

	test("returns null if can't find a parent attribute", () => {
		let g = document.getElementById('id-g')
		let attr = DOMUtil.findParentAttr(g, 'data-y')

		expect(attr).toBe(null)
	})

	test('finds parent component elements', () => {
		let a = document.getElementById('id-a')
		let d = document.getElementById('id-d')
		let g = document.getElementById('id-g')
		let els = DOMUtil.findParentComponentElements(g)

		expect([...els]).toEqual([g, d, a])
	})

	test('finds parent component elements ids', () => {
		let a = document.getElementById('id-a')
		let d = document.getElementById('id-d')
		let g = document.getElementById('id-g')
		let ids = DOMUtil.findParentComponentIds(g)

		expect([...ids]).toEqual(['i-g', 'i-d', 'i-a'])
	})

	test('elementLikeComponent checks an element to verify it seems to be a component', () => {
		let g = document.getElementById('id-g')
		let j = document.getElementById('id-j')

		expect(DOMUtil.elementLikeComponent(g)).toBe(true)
		expect(DOMUtil.elementLikeComponent(j)).toBe(false)
	})

	test('gets the first text node of an element', () => {
		let c = document.getElementById('id-c')
		let g = document.getElementById('id-g')

		expect(DOMUtil.getFirstTextNodeOfElement(g).textContent).toBe(
			'Second text with some line breaks and '
		)
	})

	test('gets the text nodes of a document in order', () => {
		let a = document.getElementById('id-a')
		let g = document.getElementById('id-g')
		let textNodeContents = DOMUtil.getTextNodesInOrder(a).map(t => t.textContent)

		expect(textNodeContents).toEqual([
			'First text',
			'Second text with some line breaks and ',
			'bolded ',
			'italic',
			' content',
			' inside',
			'Third text',
			'Not quite a real obo component'
		])
	})
})

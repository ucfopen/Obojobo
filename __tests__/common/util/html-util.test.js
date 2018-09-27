import { sanitize, isElementInline } from '../../../src/scripts/common/util/html-util'

describe('HTMLUtils', () => {
	test('sanitize() will strip out scripts and most tags', () => {
		const div = document.createElement('div')
		const html = `
			<div>
				<script>alert('Hacked!');</script>
				<a href="www.site.com" cite="citation" style="{color:red;}">Link</a>
				<a href="www.site.com" cite="citation" style="{color:red;}" target="_blank">Link</a>
				<ul>
					<li>
						<a href="www.site.com" cite="citation" style="{color:red;}" target="_blank">Link</a>
						<script>alert("Hacked again!!!");</script>
					</li>
				</ul>
			</div>`

		div.innerHTML = html

		sanitize(div)

		expect(div.innerHTML).toEqual(`
			<div>
				<span></span>
				<a href="www.site.com" cite="citation" style="{color:red;}">Link</a>
				<a href="www.site.com" cite="citation" style="{color:red;}" target="">Link</a>
				<ul>
					<li>
						<a href="www.site.com" cite="citation" style="{color:red;}" target="">Link</a>
						<span></span>
					</li>
				</ul>
			</div>`)
	})

	test('isElementInline reports if an element is an inline element :)', () => {
		expect(isElementInline(document.createElement('html'))).toBe(false)
		expect(isElementInline(document.createElement('title'))).toBe(false)
		expect(isElementInline(document.createElement('body'))).toBe(false)
		expect(isElementInline(document.createElement('h1'))).toBe(false)
		expect(isElementInline(document.createElement('h2'))).toBe(false)
		expect(isElementInline(document.createElement('h3'))).toBe(false)
		expect(isElementInline(document.createElement('h4'))).toBe(false)
		expect(isElementInline(document.createElement('h5'))).toBe(false)
		expect(isElementInline(document.createElement('h6'))).toBe(false)
		expect(isElementInline(document.createElement('p'))).toBe(false)
		expect(isElementInline(document.createElement('br'))).toBe(true)
		expect(isElementInline(document.createElement('hr'))).toBe(false)
		expect(isElementInline(document.createElement('acronym'))).toBe(true)
		expect(isElementInline(document.createElement('abbr'))).toBe(true)
		expect(isElementInline(document.createElement('address'))).toBe(false)
		expect(isElementInline(document.createElement('b'))).toBe(true)
		expect(isElementInline(document.createElement('bdi'))).toBe(false)
		expect(isElementInline(document.createElement('bdo'))).toBe(true)
		expect(isElementInline(document.createElement('big'))).toBe(true)
		expect(isElementInline(document.createElement('blockquote'))).toBe(false)
		expect(isElementInline(document.createElement('center'))).toBe(false)
		expect(isElementInline(document.createElement('cite'))).toBe(true)
		expect(isElementInline(document.createElement('code'))).toBe(true)
		expect(isElementInline(document.createElement('del'))).toBe(false)
		expect(isElementInline(document.createElement('dfn'))).toBe(true)
		expect(isElementInline(document.createElement('em'))).toBe(true)
		expect(isElementInline(document.createElement('font'))).toBe(false)
		expect(isElementInline(document.createElement('i'))).toBe(true)
		expect(isElementInline(document.createElement('ins'))).toBe(false)
		expect(isElementInline(document.createElement('kbd'))).toBe(true)
		expect(isElementInline(document.createElement('mark'))).toBe(false)
		expect(isElementInline(document.createElement('meter'))).toBe(false)
		expect(isElementInline(document.createElement('pre'))).toBe(false)
		expect(isElementInline(document.createElement('progress'))).toBe(false)
		expect(isElementInline(document.createElement('q'))).toBe(true)
		expect(isElementInline(document.createElement('rp'))).toBe(false)
		expect(isElementInline(document.createElement('rt'))).toBe(false)
		expect(isElementInline(document.createElement('ruby'))).toBe(false)
		expect(isElementInline(document.createElement('s'))).toBe(false)
		expect(isElementInline(document.createElement('samp'))).toBe(true)
		expect(isElementInline(document.createElement('small'))).toBe(true)
		expect(isElementInline(document.createElement('strike'))).toBe(false)
		expect(isElementInline(document.createElement('strong'))).toBe(true)
		expect(isElementInline(document.createElement('sub'))).toBe(true)
		expect(isElementInline(document.createElement('sup'))).toBe(true)
		expect(isElementInline(document.createElement('time'))).toBe(true)
		expect(isElementInline(document.createElement('tt'))).toBe(true)
		expect(isElementInline(document.createElement('u'))).toBe(false)
		expect(isElementInline(document.createElement('var'))).toBe(true)
		expect(isElementInline(document.createElement('wbr'))).toBe(false)
		expect(isElementInline(document.createElement('form'))).toBe(false)
		expect(isElementInline(document.createElement('input'))).toBe(true)
		expect(isElementInline(document.createElement('textarea'))).toBe(true)
		expect(isElementInline(document.createElement('button'))).toBe(true)
		expect(isElementInline(document.createElement('select'))).toBe(true)
		expect(isElementInline(document.createElement('optgroup'))).toBe(false)
		expect(isElementInline(document.createElement('option'))).toBe(false)
		expect(isElementInline(document.createElement('label'))).toBe(true)
		expect(isElementInline(document.createElement('fieldset'))).toBe(false)
		expect(isElementInline(document.createElement('legend'))).toBe(false)
		expect(isElementInline(document.createElement('datalist'))).toBe(false)
		expect(isElementInline(document.createElement('keygen'))).toBe(false)
		expect(isElementInline(document.createElement('output'))).toBe(false)
		expect(isElementInline(document.createElement('frame'))).toBe(false)
		expect(isElementInline(document.createElement('frameset'))).toBe(false)
		expect(isElementInline(document.createElement('noframes'))).toBe(false)
		expect(isElementInline(document.createElement('iframe'))).toBe(false)
		expect(isElementInline(document.createElement('img'))).toBe(true)
		expect(isElementInline(document.createElement('map'))).toBe(true)
		expect(isElementInline(document.createElement('area'))).toBe(false)
		expect(isElementInline(document.createElement('canvas'))).toBe(false)
		expect(isElementInline(document.createElement('figcaption'))).toBe(false)
		expect(isElementInline(document.createElement('figure'))).toBe(false)
		expect(isElementInline(document.createElement('picture'))).toBe(false)
		expect(isElementInline(document.createElement('audio'))).toBe(false)
		expect(isElementInline(document.createElement('source'))).toBe(false)
		expect(isElementInline(document.createElement('track'))).toBe(false)
		expect(isElementInline(document.createElement('video'))).toBe(false)
		expect(isElementInline(document.createElement('a'))).toBe(true)
		expect(isElementInline(document.createElement('link'))).toBe(false)
		expect(isElementInline(document.createElement('nav'))).toBe(false)
		expect(isElementInline(document.createElement('ul'))).toBe(false)
		expect(isElementInline(document.createElement('ol'))).toBe(false)
		expect(isElementInline(document.createElement('li'))).toBe(false)
		expect(isElementInline(document.createElement('dir'))).toBe(false)
		expect(isElementInline(document.createElement('dl'))).toBe(false)
		expect(isElementInline(document.createElement('dt'))).toBe(false)
		expect(isElementInline(document.createElement('dd'))).toBe(false)
		expect(isElementInline(document.createElement('menu'))).toBe(false)
		expect(isElementInline(document.createElement('menuitem'))).toBe(false)
		expect(isElementInline(document.createElement('table'))).toBe(false)
		expect(isElementInline(document.createElement('caption'))).toBe(false)
		expect(isElementInline(document.createElement('th'))).toBe(false)
		expect(isElementInline(document.createElement('tr'))).toBe(false)
		expect(isElementInline(document.createElement('td'))).toBe(false)
		expect(isElementInline(document.createElement('thead'))).toBe(false)
		expect(isElementInline(document.createElement('tbody'))).toBe(false)
		expect(isElementInline(document.createElement('tfoot'))).toBe(false)
		expect(isElementInline(document.createElement('col'))).toBe(false)
		expect(isElementInline(document.createElement('colgroup'))).toBe(false)
		expect(isElementInline(document.createElement('style'))).toBe(false)
		expect(isElementInline(document.createElement('div'))).toBe(false)
		expect(isElementInline(document.createElement('span'))).toBe(true)
		expect(isElementInline(document.createElement('header'))).toBe(false)
		expect(isElementInline(document.createElement('footer'))).toBe(false)
		expect(isElementInline(document.createElement('main'))).toBe(false)
		expect(isElementInline(document.createElement('section'))).toBe(false)
		expect(isElementInline(document.createElement('article'))).toBe(false)
		expect(isElementInline(document.createElement('aside'))).toBe(false)
		expect(isElementInline(document.createElement('details'))).toBe(false)
		expect(isElementInline(document.createElement('dialog'))).toBe(false)
		expect(isElementInline(document.createElement('summary'))).toBe(false)
		expect(isElementInline(document.createElement('data'))).toBe(false)
		expect(isElementInline(document.createElement('head'))).toBe(false)
		expect(isElementInline(document.createElement('meta'))).toBe(false)
		expect(isElementInline(document.createElement('base'))).toBe(false)
		expect(isElementInline(document.createElement('basefont'))).toBe(false)
		expect(isElementInline(document.createElement('script'))).toBe(true)
		expect(isElementInline(document.createElement('noscript'))).toBe(false)
		expect(isElementInline(document.createElement('applet'))).toBe(false)
		expect(isElementInline(document.createElement('embed'))).toBe(false)
		expect(isElementInline(document.createElement('object'))).toBe(true)
		expect(isElementInline(document.createElement('param'))).toBe(false)
	})
})

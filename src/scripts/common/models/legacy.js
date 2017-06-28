let patternAddUL = /<LI>([\s\S]*?)<\/LI>/gi
let patternRemoveExtraUL = /<\/ul><ul>/gi
let patternTF = /<\/?textformat\s?[\s\S]*?>/gi

import OboModel from '../../common/models/obo-model'
import StyleableText from '../../common/text/styleable-text'

var Legacy = {
	createModuleFromObo2ModuleJSON(json) {
		let oboModule = OboModel.create('ObojoboDraft.Modules.Module')

		let objective = OboModel.create('ObojoboDraft.Sections.Content')
		// oboModule.children.add objective
		let objectivePage = OboModel.create('ObojoboDraft.Pages.Page')
		objective.children.add(objectivePage)
		objectivePage.children.add(Legacy.createChunksFromObo2HTML(json.objective))

		let content = OboModel.create('ObojoboDraft.Sections.Content')
		for (let page of Array.from(json.pages)) {
			content.children.add(Legacy.createPageFromObo2ModuleJSON(page))
		}

		oboModule.children.add(objective)
		oboModule.children.add(content)

		return oboModule
	},

	createPageFromObo2ModuleJSON(json) {
		let page = OboModel.create('ObojoboDraft.Pages.Page')

		let header = OboModel.create('ObojoboDraft.Chunks.Heading')
		header.modelState.textGroup.first.text.value = json.title
		page.children.add(header)

		for (let item of Array.from(json.items)) {
			switch (item.component) {
				case 'TextArea':
					page.children.add(Legacy.createChunksFromObo2HTML(item.data))
					break

				case 'MediaView':
					page.children.add(Legacy.createMediaFromObo2JSON(item.media))
					break
			}
		}

		return page
	},

	createChunksFromObo2HTML(html) {
		let chunks = []

		// get rid of all the textformat tags
		html = html.replace(patternTF, '')

		// add <ul></ul> arround list items
		html = html.replace(patternAddUL, '<ul><li>$1</li></ul>')

		//kill extra </ul><ul> that are back to back - this will make proper lists
		html = html.replace(patternRemoveExtraUL, '')

		let el = document.createElement('div')
		document.body.appendChild(el)
		el.innerHTML = html

		let sts = null
		for (let child of Array.from(el.children)) {
			var chunk
			switch (child.tagName.toLowerCase()) {
				case 'ul':
					chunk = OboModel.create('ObojoboDraft.Chunks.List')
					break

				default:
					chunk = OboModel.create('ObojoboDraft.Chunks.Text')
			}

			let tg = chunk.modelState.textGroup
			tg.clear()
			sts = StyleableText.createFromElement(child)
			for (let st of Array.from(sts)) {
				tg.add(st)
			}

			chunks.push(chunk)
		}

		document.body.removeChild(el)

		console.log('-----------------')
		console.log(html)
		console.log(el.innerHTML)
		console.log(chunks)
		console.log(sts)

		return chunks
	},

	createMediaFromObo2JSON(json) {
		return OboModel.create('ObojoboDraft.Chunks.Figure')
	}
}

export default Legacy

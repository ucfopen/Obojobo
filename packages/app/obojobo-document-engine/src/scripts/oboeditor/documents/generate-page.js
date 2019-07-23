import generateId from '../generate-ids'

const generatePage = () => ({
	id: generateId(),
	type: "ObojoboDraft.Pages.Page",
	content: {},
	children: [
		{
			id: generateId(),
			type: "ObojoboDraft.Chunks.Heading",
			content: {
				headingLevel: 1,
				textGroup: [
					{
						text: {
							value: ""
						}
					}
				]
			},
			children: []
		},
		{
			id: generateId(),
			type: "ObojoboDraft.Chunks.Text",
			content: {
				textGroup: [
					{
						text: {
							value: ""
						}
					}
				]
			},
			children: []
		}
	]
})

export default generatePage

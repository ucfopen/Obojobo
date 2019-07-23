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
							value: "Add a Title Here"
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
							value: "Add some content here"
						}
					}
				]
			},
			children: []
		}
	]
})

export default generatePage

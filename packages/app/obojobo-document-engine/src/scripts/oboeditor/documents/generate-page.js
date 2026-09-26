import generateId from '../generate-ids'

const generatePage = () => ({
	id: generateId(),
	type: 'ObojoboDraft.Pages.Page',
	content: {},
	children: [
		{
			id: generateId(),
			type: 'ObojoboDraft.Chunks.Heading',
			content: {
				headingLevel: 1,
				textGroup: [
					{
						text: {
							updated: ''
						}
					}
				]
			},
			children: []
		},
		{
			id: generateId(),
			type: 'ObojoboDraft.Chunks.Text',
			content: {
				textGroup: [
					{
						text: {
							updated: ''
						}
					}
				]
			},
			children: []
		}
	]
})

export default generatePage

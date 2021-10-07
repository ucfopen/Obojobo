import MateriaRegistration from 'obojobo-chunks-materia/editor-registration'

import emptyNode from './empty-node.json'

const MATERIA_ASSESSMENT_NODE = 'ObojoboDraft.Chunks.MateriaAssessment'

const MateriaAssessment = {
	...MateriaRegistration,
	name: MATERIA_ASSESSMENT_NODE,
	menuLabel: 'Materia Widget Assessment',
	json: {
		emptyNode
	}
}

export default MateriaAssessment

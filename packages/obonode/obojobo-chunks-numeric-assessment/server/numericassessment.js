const DraftNode = require('obojobo-express/models/draft_node')

class NumericAssessment extends DraftNode {
	static get nodeName() {
		return 'ObojoboDraft.Chunks.NumericAssessment'
	}
}

module.exports = NumericAssessment

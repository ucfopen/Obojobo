let registration = {
	title: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
	instance: {
		listeners: {
			'internal:sendToClient': function(req, res) {
				this.node.content.score = 0
			}
		}
	}
}


module.exports = registration
let registration = {
	title: 'ObojoboDraft.Chunks.MCAssessment.MCChoice',
	instance: {
		listeners: {
			'internal:sendToClient': function(req, res) {
				// console.log('***************HEEARDDDDD=============================')
				this.node.content.score = 0
			}
		}
	}
}


module.exports = registration
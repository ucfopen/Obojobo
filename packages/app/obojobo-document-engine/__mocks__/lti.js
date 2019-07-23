const lti = jest.fn()
lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId = jest.fn()
lti.replaceResult = jest.fn()
lti.sendHighestAssessmentScore = jest.fn()
lti.getLatestHighestAssessmentScoreRecord = jest.fn()
module.exports = lti

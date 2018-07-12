import * as LTIStatus from '../../../../../../../ObojoboDraft/Sections/Assessment/components/post-test/lti-status'

describe('LTIStatus getLTIStatusProps', () => {
	const p = LTIStatus.getLTIStatusProps

	test('getLTIStatusProps transforms LTIStatus props into a flat structure', () => {
		expect(
			p({
				ltiState: {
					state: {
						gradebookStatus: 'mock-gradebook-status'
					},
					networkState: 'mock-network-state',
					resyncState: 'mock-resync-state'
				},
				externalSystemLabel: 'mock-external-system-label',
				assessmentScore: 33.3,
				isPreviewing: 'mock-is-previewing'
			})
		).toEqual({
			isLTIDataComplete: true,
			gradebookStatus: 'mock-gradebook-status',
			networkState: 'mock-network-state',
			resyncState: 'mock-resync-state',
			isPreviewing: 'mock-is-previewing',
			externalSystemLabel: 'mock-external-system-label',
			roundedAssessmentScore: 33
		})
	})

	test('handles incomplete LTI data', () => {
		expect(
			p({
				externalSystemLabel: 'mock-external-system-label',
				assessmentScore: 33.3,
				isPreviewing: 'mock-is-previewing'
			})
		).toEqual({
			isLTIDataComplete: false,
			gradebookStatus: null,
			networkState: null,
			resyncState: null,
			isPreviewing: 'mock-is-previewing',
			externalSystemLabel: 'mock-external-system-label',
			roundedAssessmentScore: 33
		})

		expect(
			p({
				ltiState: {
					networkState: 'mock-network-state',
					resyncState: 'mock-resync-state'
				},
				externalSystemLabel: 'mock-external-system-label',
				assessmentScore: 33.3,
				isPreviewing: 'mock-is-previewing'
			})
		).toEqual({
			isLTIDataComplete: false,
			gradebookStatus: null,
			networkState: 'mock-network-state',
			resyncState: 'mock-resync-state',
			isPreviewing: 'mock-is-previewing',
			externalSystemLabel: 'mock-external-system-label',
			roundedAssessmentScore: 33
		})
	})
})

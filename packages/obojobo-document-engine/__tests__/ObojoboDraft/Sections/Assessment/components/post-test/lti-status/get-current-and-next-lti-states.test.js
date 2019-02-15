import LTIStatus from '../../../../../../../ObojoboDraft/Sections/Assessment/components/post-test/lti-status'

describe('LTIStatus getCurrentAndNextLTIStates', () => {
	test('Returns object with expected properties', () => {
		LTIStatus.prototype.getLTIStatusProps = jest.fn(props => {
			return {
				networkState: props.networkState,
				uiState: props.uiState
			}
		})

		LTIStatus.prototype.getUIState = jest.fn(ltiStatusProps => ltiStatusProps.uiState)

		const ltiStatus = new LTIStatus()

		expect(
			ltiStatus.getCurrentAndNextLTIStates(
				{
					networkState: 'current-network-state',
					uiState: 'current-ui-state'
				},
				{
					networkState: 'next-network-state',
					uiState: 'next-ui-state'
				}
			)
		).toEqual({
			currentLTINetworkState: 'current-network-state',
			nextLTINetworkState: 'next-network-state',
			currentUIState: 'current-ui-state',
			nextUIState: 'next-ui-state'
		})
	})
})

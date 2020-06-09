/* eslint-disable react/display-name */

import React from 'react'
import renderer from 'react-test-renderer'
import Common from 'obojobo-document-engine/src/scripts/common'
import PreAttemptImportScoreDialog from './pre-attempt-import-score-dialog'

jest.mock('Common', () => ({
	components: {
		modal: {
			Dialog: props => {
				const { customControls, ...restProps } = props
				return <div {...restProps}>{customControls}</div>
			}
		},
		Button: props => <div {...props}></div>
	}
}))

describe('PreAttemptImportScoreDialog', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('renders', () => {
		const props = {
			highestScore: 98.5,
			onChoice: 'on-change'
		}
		const component = renderer.create(<PreAttemptImportScoreDialog {...props} />)
		const tree = component.toJSON()

		expect(tree).toMatchInlineSnapshot(`
		<div
		  centered={true}
		  className="pre-attempt-import"
		  title="Import Score or Start Attempt"
		  width="300"
		>
		  <div
		    className="choice-box"
		  >
		    <h2>
		      Import Score
		    </h2>
		    <div
		      className="choice-desc"
		    >
		      Skip this assessment.
		      <br />
		      Recieve a 
		      99
		      % for this assignment and forfeit all attempts.
		    </div>
		    <div
		      onClick={[Function]}
		    >
		      Import Score: 
		      99
		      %
		    </div>
		  </div>
		  <div
		    className="or-box"
		  >
		    or
		  </div>
		  <div
		    className="choice-box"
		  >
		    <h2>
		      Start Attempt
		    </h2>
		    <div
		      className="choice-desc"
		    >
		      Take this assessment.
		      <br />
		      Give up the ability to import your previous score.
		    </div>
		    <div
		      onClick={[Function]}
		    >
		      Start Attempt
		    </div>
		  </div>
		</div>
	`)
	})

	test('handles Do not import click', () => {
		const props = {
			highestScore: 98.5,
			onChoice: jest.fn()
		}
		const component = renderer.create(<PreAttemptImportScoreDialog {...props} />)
		const buttons = component.root.findAllByType(Common.components.Button)

		expect(buttons[0].props.children).toEqual(['Import Score: ', 99, '%'])
		expect(props.onChoice).toHaveBeenCalledTimes(0)
		buttons[0].props.onClick()
		expect(props.onChoice).toHaveBeenCalledTimes(1)
		expect(props.onChoice).toHaveBeenCalledWith(true)
	})

	test('handles import click', () => {
		const props = {
			highestScore: 98.5,
			onChoice: jest.fn()
		}
		const component = renderer.create(<PreAttemptImportScoreDialog {...props} />)
		const buttons = component.root.findAllByType(Common.components.Button)

		expect(buttons[1].props.children).toEqual('Start Attempt')
		expect(props.onChoice).toHaveBeenCalledTimes(0)
		buttons[1].props.onClick()
		expect(props.onChoice).toHaveBeenCalledTimes(1)
		expect(props.onChoice).toHaveBeenCalledWith(false)
	})
})

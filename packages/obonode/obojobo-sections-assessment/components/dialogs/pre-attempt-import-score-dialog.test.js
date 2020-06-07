/* eslint-disable react/display-name */

import React from 'react'
import renderer from 'react-test-renderer'

import PreAttemptImportScoreDialog from './pre-attempt-import-score-dialog'

jest.mock('Common', () => ({
	components: {
		modal: {
			Dialog: props => <div {...props}></div>
		}
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
		  buttons={
		    Array [
		      Object {
		        "onClick": [Function],
		        "value": "Do Not Import",
		      },
		      Object {
		        "onClick": [Function],
		        "value": "Import Score: 99%",
		      },
		    ]
		  }
		  centered={true}
		  title="Import Score or Start Attempt"
		  width="300"
		>
		  <p>
		    You previously completed this module in another course. Your highest score can be imported for this assignment.
		  </p>
		  <p>
		    Import 
		    <b>
		      99
		      %
		    </b>
		     for your final score 
		    <i>
		      or
		    </i>
		     attempt the assessment?
		  </p>
		</div>
	`)
	})

	test('handles Do not import click', () => {
		const props = {
			highestScore: 98.5,
			onChoice: jest.fn()
		}
		const component = renderer.create(<PreAttemptImportScoreDialog {...props} />)
		const buttons = component.root.findByProps({ centered: true }).props.buttons

		expect(buttons[0]).toHaveProperty('value', 'Do Not Import')
		expect(props.onChoice).toHaveBeenCalledTimes(0)
		buttons[0].onClick()
		expect(props.onChoice).toHaveBeenCalledTimes(1)
		expect(props.onChoice).toHaveBeenCalledWith(false)
	})

	test('handles import click', () => {
		const props = {
			highestScore: 98.5,
			onChoice: jest.fn()
		}
		const component = renderer.create(<PreAttemptImportScoreDialog {...props} />)
		const buttons = component.root.findByProps({ centered: true }).props.buttons

		expect(buttons[1]).toHaveProperty('value', 'Import Score: 99%')
		expect(props.onChoice).toHaveBeenCalledTimes(0)
		buttons[1].onClick()
		expect(props.onChoice).toHaveBeenCalledTimes(1)
		expect(props.onChoice).toHaveBeenCalledWith(true)
	})
})

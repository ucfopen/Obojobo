import './mod-properties.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components
const { Slider } = Common.components.slider
const getParsedRange = Common.util.RangeParsing.getParsedRange

class ModProperties extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mods: props.mods
		}
	}

	focusOnFirstElement() {
		return this.inputRef.current.focus()
	}

	onChangeSlider(index, values) {
		const lowerVal = values[0] === this.props.attempts+1 ? "$last_attempt" : values[0]
		const upperVal = values[1] === this.props.attempts+1 ? "$last_attempt" : values[1]
		const attemptCondition = "[" + lowerVal + "," + upperVal + "]"
		this.setState(prevState => ({ 
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? Object.assign(mod, { attemptCondition }) : mod)
			)
		}))
	}

	render() {
		return (
			<SimpleDialog
				ok
				title="Extra Credit & Penalties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
				<div className="mod-properties">
					<p className="info">You can add or deduct percentage points from a student&apos;s assessment score based on which attempt they achived a passing score. (The final assessment score is still limited to a maximum of 100%)</p>
					<div className="mod-box">
						{this.state.mods.map((mod, index) => {
							const range = getParsedRange(mod.attemptCondition)
							// If there are unlimited attempts, limit the mods to the first 20 attempts
							// Otherwise, add one to the number of attempts to make a space for $last_attempt
							const upperRange = this.props.attempts === 'unlimited' ? 20 : this.props.attempts + 1

							const lowerVal = range.min === '$last_attempt' ? upperRange : parseInt(range.min, 10)
							const upperVal = range.max === '$last_attempt' ? upperRange : parseInt(range.max, 10)

							return (
								<div key={index} className="mod">
									<label>When passing on attempt</label>
									<Slider 
										domain={[1, upperRange]}
										values={[lowerVal, upperVal]}
										step={1}
										onChange={this.onChangeSlider.bind(this,index)}/>
									<div className="slider-inputs">
										<input type="text" value={range.min} className="min-input"/>
										<input type="text" value={range.max} className="max-input"/>
									</div>
									<label>Add <input type="number" value={mod.reward}/>%</label>
								</div>
							)
						})}
						<Button>Add Mod</Button>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ModProperties

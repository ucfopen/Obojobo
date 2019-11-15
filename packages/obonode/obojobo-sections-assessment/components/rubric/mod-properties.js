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
		console.log(values)
		const lowerVal = values[0] === this.props.attempts+1 ? "$last_attempt" : values[0]
		const upperVal = values[1] === this.props.attempts+1 ? "$last_attempt" : values[1]
		const attemptCondition = "[" + lowerVal + "," + upperVal + "]"
		this.setState(prevState => ({ 
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? Object.assign(mod, { attemptCondition }) : mod)
			)
		}))
	}

	onChangeReward(index, event) {
		const reward = event.target.value
		this.setState(prevState => ({ 
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? Object.assign(mod, { reward }) : mod)
			)
		}))
	}

	onChangeLower(index, event) {
		const lower = event.target.value
		const range = getParsedRange(this.state.mods[index].attemptCondition)
		const attemptCondition = "[" + lower + "," + range.max + "]"
		this.setState(prevState => ({ 
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? Object.assign(mod, { attemptCondition }) : mod)
			)
		}))
	}

	onChangeUpper(index, event) {
		const upper = event.target.value
		const range = getParsedRange(this.state.mods[index].attemptCondition)
		const attemptCondition = "[" + range.min + "," + upper + "]"
		this.setState(prevState => ({ 
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? Object.assign(mod, { attemptCondition }) : mod)
			)
		}))
	}

	onAddMod() {
		this.setState(prevState => ({
			mods: [...prevState.mods, { reward: 0, attemptCondition: "[1,$last_attempt]"}]
		}))
	}

	deleteMod(index) {
		this.setState(prevState => ({
			mods: prevState.mods.map(
				(mod, listIndex) => (index === listIndex ? null : mod)
			).filter(Boolean)
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

							// safely wrap string values like $last_attempt as the highest value
							const lower = parseInt(range.min, 10)
							const lowerVal = isNaN(lower) ? upperRange : lower
							const upper = parseInt(range.max, 10)
							const upperVal = isNaN(upper) ? upperRange : upper

							return (
								<div key={index} className="mod">
									<Button 
										className="delete-button" 
										onClick={this.deleteMod.bind(this,index)}>
										×
									</Button>
									<label>When passing on attempt</label>
									<div className="slider-container">
										<Slider 
											domain={[1, upperRange]}
											values={[lowerVal, upperVal]}
											step={1}
											onChange={this.onChangeSlider.bind(this,index)}/>
									</div>
									<div className="slider-inputs">
										<input type="text" value={range.min} className="min-input" onChange={this.onChangeLower.bind(this,index)}/>
										through
										<input type="text" value={range.max} className="max-input" onChange={this.onChangeUpper.bind(this,index)}/>
									</div>
									<label className="add">
										Add <input type="number" value={mod.reward} onChange={this.onChangeReward.bind(this,index)}/>%
									</label>
								</div>
							)
						})}
						{this.state.mods.length < 20 ? <Button onClick={this.onAddMod.bind(this)}>Add Mod</Button>: null}
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ModProperties

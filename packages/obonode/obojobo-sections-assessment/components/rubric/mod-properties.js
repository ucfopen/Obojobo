import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'

const { SimpleDialog } = Common.components.modal
const { Button } = Common.components

class ModProperties extends React.Component {
	constructor(props) {
		super(props)

		console.log(props)

		const rewards = props.mods.filter(mod => mod.reward >= 0)
		const penalties = props.mods.filter(mod => mod.reward < 0)

		this.state = {
			rewards,
			penalties
		}
	}

	focusOnFirstElement() {
		return this.inputRef.current.focus()
	}

	render() {
		return (
			<SimpleDialog
				ok
				title="Extra Credit & Penalties"
				onConfirm={() => this.props.onConfirm(this.state)}
				focusOnFirstElement={this.focusOnFirstElement.bind(this)}>
				<div className="mod-properties">
					<p>You can add or deduct percentage points from a student&apos;s assessment score based on which attempt they achived a passing score. (The final assessment score is still limited to a maximum of 100%)</p>
					<h2>Rewards</h2>
					<div>
						<div>
							Add +5% if a student passes on
							<input type="radio" name="hello" value="fakjg" />
							<input type="radio" name="hello" value="fakjg" />
						</div>
						<Button>Add Reward</Button>
					</div>
					<h2>Penalties</h2>
					<div>
						<Button>Add Reward</Button>
					</div>
				</div>
			</SimpleDialog>
		)
	}
}

export default ModProperties

import './slider.scss'

import React from 'react'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'

import Track from './track'
import Handle from './handle'
import SliderRail from './slider-rail'
import SliderUtils from './slider-utils'

class OboSlider extends React.Component {
	constructor(props) {
		super(props)

		this.onChange = this.onChange.bind(this)
	}

	onChange(values) {
		this.props.onChange(values)
		this.setState({ values })
	}

	render() {
		return (
			<div className="obojobo-draft--components--slider--slider">
				<Slider
					mode={SliderUtils.mode4}
					step={this.props.step}
					domain={this.props.domain}
					onUpdate={this.props.onChange}
					onChange={this.props.onChange}
					className="slider-root"
					values={this.props.values}
				>
					<Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
					<Handles>
						{({ handles, getHandleProps }) => (
							<div className="slider-handles">
								{handles.map(handle => (
									<Handle
										key={handle.id}
										handle={handle}
										domain={this.props.domain}
										getHandleProps={getHandleProps}
									/>
								))}
							</div>
						)}
					</Handles>
					<Tracks left={false} right={false}>
						{({ tracks, getTrackProps }) => (
							<div className="slider-tracks">
								{tracks.map(({ id, source, target }) => (
									<Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
								))}
							</div>
						)}
					</Tracks>
				</Slider>
			</div>
		)
	}
}

export default OboSlider

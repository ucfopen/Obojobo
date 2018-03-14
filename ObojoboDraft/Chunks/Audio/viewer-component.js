import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { NonEditableChunk } = Common.chunk

let Button = Common.components.Button

// console.log(xml)

// require('./osmd.min.js')
// import { OSMD } from 'opensheetmusicdisplay'

// import Iterator from 'musicxml-iterator'

import WaveSurfer from 'wavesurfer.js'

// import { OSMD } from '../src/OSMD/OSMD';
// import { OSMD } from '../../../node_modules/opensheetmusicdisplay/src/OSMD/OSMD'

import volumeIcon from 'svg-url-loader?noquotes!./volume-icon.svg'
import volumeTrack from 'svg-url-loader?noquotes!./volume-track.svg'
import volumeCurrent from 'svg-url-loader?noquotes!./volume-current.svg'

export default class Audio extends React.Component {
	constructor() {
		super()

		this.state = {
			isLoaded: false,
			isPlaying: false,
			isShowingTranscription: false,
			playbackSpeed: 1,
			volume: 0.8
		}

		console.log('CC')

		// Common.Store.loadDependency('./osmd.min.js', () => {
		// Common.Store.loadDependency('http://127.0.0.1:8765/osmd.min.js', () => {
		// 	let osmd = new window.opensheetmusicdisplay.OSMD('some-container')
		// 	console.log('osmd', osmd)
		// })
	}

	onClick() {
		if (this.wavesurfer.isPlaying()) {
			this.wavesurfer.pause()
			this.setState({ isPlaying: false })
		} else {
			this.wavesurfer.play()
			this.setState({ isPlaying: true })
		}
	}

	onClickToggleTranscription() {}

	onChangeSpeed(event) {
		// this.wavesurfer.setPlaybackRate(event.target.value)
		this.setState({ playbackSpeed: event.target.value })
	}

	onChangeVolume(event) {
		this.setState({ volume: event.target.value })
	}

	componentWillUnmount() {
		this.wavesurfer.destroy()
	}

	componentDidMount() {
		console.log('CDU', this.props.model.modelState)
		// this.osmd = new OSMD(this.refs.self, false)
		// this.osmd.load(this.props.model.modelState.xml).then(
		// 	() => {
		// 		this.osmd.zoom = this.props.model.modelState.zoomLevel
		// 		this.osmd.render()

		// 		this.iter = Iterator(this.props.model.modelState.xml)
		// 		this.iter.selectInstrument('Voice')
		// 	},
		// 	err => console.log(err)
		// )

		this.wavesurfer = WaveSurfer.create({
			container: this.refs.self,
			waveColor: '#8baadb',
			// progressColor: '#2b0a53',
			progressColor: '#c1c1c1',
			cursorColor: '#93C6FF',
			// cursorWidth: 3,
			normalize: true,
			height: 64
		})
		this.wavesurfer.load(
			this.props.model.modelState.src
			// 'https://dl.dropboxusercontent.com/content_link/BGQJulxUfTjAFnqOqYW1Rrk7rk0BNjn2g96N1SH43BCP8N5yWzJuk9PxFhcwgU9T/file?dl=0&duc_id=dropbox_duc_id'
		)
		this.wavesurfer.on('ready', () => {
			this.setState({ isLoaded: true })
		})
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.playbackSpeed !== this.state.playbackSpeed) {
			this.wavesurfer.setPlaybackRate(this.state.playbackSpeed)
		}

		if (prevState.volume !== this.state.volume) {
			this.wavesurfer.setVolume(this.state.volume)
		}
	}

	render() {
		let data = this.props.model.modelState

		let volumeIconBg = Common.util.getBackgroundImage(volumeIcon)
		let volumeTrackBg = Common.util.getBackgroundImage(volumeTrack)
		let volumeCurrentBg = Common.util.getBackgroundImage(volumeCurrent)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<NonEditableChunk
					className={
						`obojobo-draft--chunks--audio` +
						(this.state.isLoaded ? ' is-loaded' : ' is-not-loaded') +
						(this.state.isPlaying ? ' is-playing' : ' is-not-playing') +
						(this.state.isShowingTranscription
							? ' is-showing-transcription'
							: ' is-not-showing-transcription')
					}
					ref="component"
				>
					<div ref="self" className="container" />
					<div className="controls">
						<Button onClick={this.onClick.bind(this)} disabled={!this.state.isLoaded}>
							{this.state.isPlaying ? 'Pause' : 'Play'}
						</Button>

						<span className="speed-label">Speed</span>
						<div className="select">
							<select onChange={this.onChangeSpeed.bind(this)} value={this.state.playbackSpeed}>
								<option value="0.25">0.25x</option>
								<option value="0.5">0.5x</option>
								<option value="0.75">0.75x</option>
								<option value="1">1x</option>
								<option value="1.25">1.25x</option>
								<option value="1.5">1.5x</option>
								<option value="2">2x</option>
							</select>
						</div>
						<div
							className="volume"
							style={{
								backgroundImage: volumeTrackBg
							}}
						>
							<div
								className="volume-icon"
								style={{
									backgroundImage: volumeIconBg
								}}
							/>
							<input
								type="range"
								onChange={this.onChangeVolume.bind(this)}
								value={this.state.volume}
								min="0"
								max="1"
								step="0.05"
							/>
							<div
								className="current-level-container"
								style={{
									width: this.state.volume * 100 + '%'
								}}
							>
								<div
									className="current-level"
									style={{
										backgroundImage: volumeCurrentBg
									}}
								/>
							</div>
						</div>
					</div>
				</NonEditableChunk>
			</OboComponent>
		)
	}
}

import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { NonEditableChunk } = Common.chunk

// console.log(xml)

// require('./osmd.min.js')
import { OSMD } from 'opensheetmusicdisplay'

// import Iterator from 'musicxml-iterator'

// import WaveSurfer from 'wavesurfer.js'

// import { OSMD } from '../src/OSMD/OSMD';
// import { OSMD } from '../../../node_modules/opensheetmusicdisplay/src/OSMD/OSMD'

export default class SheetMusic extends React.Component {
	constructor() {
		super()

		this.setState({
			ready: false
		})

		console.log('CC')

		// Common.Store.loadDependency('./osmd.min.js', () => {
		// Common.Store.loadDependency('http://127.0.0.1:8765/osmd.min.js', () => {
		// 	let osmd = new window.opensheetmusicdisplay.OSMD('some-container')
		// 	console.log('osmd', osmd)
		// })
	}

	onClick() {
		// this.osmd.cursor.show()
		// // this.osmd.cursor.updateStyle(10, '#ff0000')
		// this.osmd.cursor.next()
		// console.log(this.iter.next())
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // this.osmd.cursor.next()
		// // let i = Iterator(this.props.model.modelState.xml)
		// // console.log(i.getInstrumentNames())
		// // i.selectInstrument('Voice')
		// // console.log(i.next())
		// this.wavesurfer.play(2, 3)
	}

	componentDidMount() {
		console.log('CDU', this.props.model.modelState)
		this.osmd = new OSMD(this.refs.self, false)
		this.osmd.load(this.props.model.modelState.xml).then(
			() => {
				this.osmd.zoom = this.props.model.modelState.zoomLevel
				this.osmd.render()

				this.iter = Iterator(this.props.model.modelState.xml)
				this.iter.selectInstrument('Voice')
			},
			err => console.log(err)
		)

		// this.wavesurfer = WaveSurfer.create({
		// 	container: this.refs.audio,
		// 	waveColor: 'violet',
		// 	progressColor: 'purple'
		// })
		// this.wavesurfer.load(
		// 	'https://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3'
		// 	// 'https://dl.dropboxusercontent.com/content_link/BGQJulxUfTjAFnqOqYW1Rrk7rk0BNjn2g96N1SH43BCP8N5yWzJuk9PxFhcwgU9T/file?dl=0&duc_id=dropbox_duc_id'
		// )
		// this.wavesurfer.on('ready', () => {

		// })
	}

	render() {
		let data = this.props.model.modelState

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<NonEditableChunk
					className={`obojobo-draft--chunks--sheet-music pad is-style-` + data.style}
					ref="component"
				>
					<div className="container" ref="self" />
				</NonEditableChunk>
			</OboComponent>
		)
	}
}

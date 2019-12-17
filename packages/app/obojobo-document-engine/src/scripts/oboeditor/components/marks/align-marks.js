import LeftIcon from '../../assets/left-icon'
import RightIcon from '../../assets/right-icon'
import CenterIcon from '../../assets/center-icon'

const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

const ALIGN_RIGHT = 'right'
const ALIGN_CENTER = 'center'
const ALIGN_LEFT = 'left'

const AlignMarks = {
	plugins: {
		onKeyDown(event, editor, next) {
			if (!(event.ctrlKey || event.metaKey)) return next()

			switch (event.key) {
				case 'l':
					event.preventDefault()
					return editor.setAlign(ALIGN_LEFT)
				case 'r':
					event.preventDefault()
					return editor.setAlign(ALIGN_RIGHT)
				case 'e':
					event.preventDefault()
					return editor.setAlign(ALIGN_CENTER)
				default:
					next()
			}
		},
		queries: {
			setAlign: (editor, align) => {
				const value = editor.value

				value.blocks.forEach(block => {
					const dataJSON = block.data.toJSON()
					if (block.type === TEXT_LINE_NODE) {
						dataJSON.align = align
					} else {
						dataJSON.content.align = align
					}

					editor.setNodeByKey(block.key, { data: dataJSON })
				})

				return true
			}
		}
	},
	marks: [
		{
			name: 'Left Align',
			type: ALIGN_LEFT,
			icon: LeftIcon,
			action: editor => editor.setAlign(ALIGN_LEFT)
		},
		{
			name: 'Center Align',
			type: ALIGN_CENTER,
			icon: CenterIcon,
			action: editor => editor.setAlign(ALIGN_CENTER)
		},
		{
			name: 'Right Align',
			type: ALIGN_RIGHT,
			icon: RightIcon,
			action: editor => editor.setAlign(ALIGN_RIGHT)
		}
	]
}

export default AlignMarks

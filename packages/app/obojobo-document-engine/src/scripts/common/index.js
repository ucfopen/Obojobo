import Bubble from './components/modal/bubble/bubble'
import Button from './components/button'
import ButtonBar from './components/button-bar'
import ChunkStyleList from './text/chunk-style-list'
import DOMUtil from './page/dom-util'
import DeleteButton from './components/delete-button'
import Dialog from './components/modal/dialog'
import Dispatcher from './flux/dispatcher'
import EditButton from './components/edit-button'
import ErrorDialog from './components/modal/error-dialog'
import ErrorUtil from './util/error-util'
import FluxStore from './flux/store'
import FocusBlocker from './components/focus-blocker'
import MockElement from './mockdom/mock-element'
import MockTextNode from './mockdom/mock-text-node'
import Modal from './components/modal/modal'
import ModalContainer from './components/modal-container'
import ModalStore from './stores/modal-store'
import ModalUtil from './util/modal-util'
import MoreInfoButton from './components/more-info-button'
import Slider from './components/slider/slider'
import NonEditableChunk from './chunk/non-editable-chunk'
import OboModel from './models/obo-model'
import Prompt from './components/modal/prompt'
import Question from './components/modal/question'
import RangeParsing from './util/range-parsing'
import { Registry } from './registry'
import SimpleDialog from './components/modal/simple-dialog'
import SimpleMessage from './components/modal/simple-message'
import SingleInputBubble from './components/modal/bubble/single-input-bubble'
import Switch from './components/switch'
import StyleRange from './text/style-range'
import StyleType from './text/style-type'
import StyleableText from './text/styleable-text'
import StyleableTextComponent from './text/styleable-text-component'
import StyleableTextRenderer from './text/styleable-text-renderer'
import TabTrap from './components/modal/tab-trap'
import TextChunk from './chunk/text-chunk'
import TextGroup from './text-group/text-group'
import TextGroupAdapter from './chunk/text-chunk/text-group-adapter'
import TextGroupEl from './chunk/text-chunk/text-group-el'
import TextGroupItem from './text-group/text-group-item'
import TextGroupUtil from './text-group/text-group-util'
import TextMenu from './components/text-menu'
import cloneProps from './util/clone-props'
import focus from './page/focus'
import isOrNot from './util/isornot'
import setProp from './util/set-prop'
import uuid from './util/uuid'
import debounce from './util/debounce'
import withoutUndefined from './util/without-undefined'

export default {
	Registry,

	chunk: {
		NonEditableChunk,
		TextChunk,
		textChunk: {
			TextGroupEl,
			TextGroupAdapter
		}
	},

	components: {
		DeleteButton,
		EditButton,
		Button,
		ButtonBar,
		MoreInfoButton,
		Switch,
		modal: {
			bubble: {
				Bubble,
				SingleInputBubble
			},
			Question,
			Prompt,
			SimpleMessage,
			Modal,
			Dialog,
			SimpleDialog,
			ErrorDialog,
			TabTrap
		},
		slider: {
			Slider
		},
		TextMenu,
		ModalContainer,
		FocusBlocker
	},

	flux: {
		Store: FluxStore,
		Dispatcher
	},

	mockDOM: {
		MockElement,
		MockTextNode
	},

	models: {
		OboModel
	},

	stores: {
		ModalStore
	},

	page: {
		DOMUtil,
		focus
	},

	text: {
		ChunkStyleList,
		StyleableText,
		StyleableTextComponent,
		StyleableTextRenderer,
		StyleRange,
		StyleType
	},

	textGroup: {
		TextGroup,
		TextGroupItem,
		TextGroupUtil
	},

	util: {
		ModalUtil,
		ErrorUtil,
		uuid,
		RangeParsing,
		setProp,
		cloneProps,
		isOrNot,
		debounce,
		withoutUndefined
	}
}

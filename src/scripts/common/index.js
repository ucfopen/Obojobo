import { Store } from './store'
import BaseSelectionHandler from './chunk/base-selection-handler'
import FocusableChunk from './chunk/focusable-chunk'
import FocusableSelectionHandler from './chunk/focusable-chunk/focusable-selection-handler'
import ToggleSelectionHandler from './chunk/focusable-chunk/toggle-selection-handler'
import NonEditableChunk from './chunk/non-editable-chunk'
import TextChunk from './chunk/text-chunk'
import TextGroupSelectionHandler from './chunk/text-chunk/text-group-selection-handler'
import TextGroupEl from './chunk/text-chunk/text-group-el'
import Linkify from './chunk/text-chunk/linkify'
import TextGroupAdapter from './chunk/text-chunk/text-group-adapter'
import ChunkUtil from './chunk/util/chunk-util'
import Insert from './chunk/util/insert'
import InsertWithText from './chunk/util/insert-with-text'
import OboComponent from './components/obo-component'
import Anchor from './components/anchor'
import DeleteButton from './components/delete-button'
import EditButton from './components/edit-button'
import Button from './components/button'
import Bubble from './components/modal/bubble/bubble'
import SingleInputBubble from './components/modal/bubble/single-input-bubble'
import Question from './components/modal/question'
import SimpleMessage from './components/modal/simple-message'
import Modal from './components/modal/modal'
import Dialog from './components/modal/dialog'
import SimpleDialog from './components/modal/simple-dialog'
import ErrorDialog from './components/modal/error-dialog'
import TextMenu from './components/text-menu'
import ModalContainer from './components/modal-container'
import FocusBlocker from './components/focus-blocker'
import FluxStore from './flux/store'
import Dispatcher from './flux/dispatcher'
import MockElement from './mockdom/mock-element'
import MockTextNode from './mockdom/mock-text-node'
import OboModel from './models/obo-model'
import Legacy from './models/legacy'
import API from './net/api'
import ChunkSelection from './selection/chunk-selection'
import Cursor from './selection/cursor'
import DOMSelection from './selection/dom-selection'
import OboSelectionRect from './selection/obo-selection-rect'
import Selection from './selection/selection'
import VirtualCursor from './selection/virtual-cursor'
import VirtualCursorData from './selection/virtual-cursor-data'
import VirtualSelection from './selection/virtual-selection'
import ModalStore from './stores/modal-store'
import FocusStore from './stores/focus-store'
import DOMUtil from './page/dom-util'
import Head from './page/head'
import Keyboard from './page/keyboard'
import Screen from './page/screen'
import ChunkStyleList from './text/chunk-style-list'
import StyleableText from './text/styleable-text'
import StyleableTextComponent from './text/styleable-text-component'
import StyleableTextRenderer from './text/styleable-text-renderer'
import StyleRange from './text/style-range'
import StyleType from './text/style-type'
import TextConstants from './text/text-constants'
import TextGroup from './text-group/text-group'
import TextGroupCursor from './text-group/text-group-cursor'
import TextGroupItem from './text-group/text-group-item'
import TextGroupSelection from './text-group/text-group-selection'
import TextGroupUtil from './text-group/text-group-util'
import Console from './util/console' // @TODO
import getBackgroundImage from './util/get-background-image'
import HtmlUtil from './util/html-util'
import ModalUtil from './util/modal-util'
import FocusUtil from './util/focus-util'
import ErrorUtil from './util/error-util'
import UUID from './util/uuid'

export default {
	Store,

	chunk: {
		BaseSelectionHandler,
		FocusableChunk,
		focusableChunk: {
			FocusableSelectionHandler,
			ToggleSelectionHandler
		},
		NonEditableChunk,
		TextChunk,
		textChunk: {
			TextGroupSelectionHandler,
			TextGroupEl,
			Linkify,
			TextGroupAdapter
		},
		util: {
			ChunkUtil,
			Insert,
			InsertWithText
		}
	},

	components: {
		OboComponent,
		Anchor,
		DeleteButton,
		EditButton,
		Button,
		modal: {
			bubble: {
				Bubble,
				SingleInputBubble
			},
			Question,
			SimpleMessage,
			Modal,
			Dialog,
			SimpleDialog,
			ErrorDialog
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
		OboModel,
		Legacy
	},

	net: {
		API
	},

	selection: {
		ChunkSelection,
		Cursor,
		DOMSelection,
		OboSelectionRect,
		Selection,
		VirtualCursor,
		VirtualCursorData,
		VirtualSelection
	},

	stores: {
		ModalStore,
		FocusStore
	},

	page: {
		DOMUtil,
		Head,
		Keyboard,
		Screen
	},

	text: {
		ChunkStyleList,
		StyleableText,
		StyleableTextComponent,
		StyleableTextRenderer,
		StyleRange,
		StyleType,
		TextConstants
	},

	textGroup: {
		TextGroup,
		TextGroupCursor,
		TextGroupItem,
		TextGroupSelection,
		TextGroupUtil
	},

	util: {
		Console,
		getBackgroundImage,
		HtmlUtil,
		ModalUtil,
		FocusUtil,
		ErrorUtil,
		UUID
	}
}

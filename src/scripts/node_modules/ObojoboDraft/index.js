import { Store } from 'ObojoboDraft/Common/store'
import BaseSelectionHandler from 'ObojoboDraft/Common/chunk/base-selection-handler'
import FocusableChunk from 'ObojoboDraft/Common/chunk/focusable-chunk'
import FocusableSelectionHandler from 'ObojoboDraft/Common/chunk/focusable-chunk/focusable-selection-handler'
import ToggleSelectionHandler from 'ObojoboDraft/Common/chunk/focusable-chunk/toggle-selection-handler'
import NonEditableChunk from 'ObojoboDraft/Common/chunk/non-editable-chunk'
import TextChunk from 'ObojoboDraft/Common/chunk/text-chunk'
import TextGroupSelectionHandler from 'ObojoboDraft/Common/chunk/text-chunk/text-group-selection-handler'
import TextGroupEl from 'ObojoboDraft/Common/chunk/text-chunk/text-group-el'
import Linkify from 'ObojoboDraft/Common/chunk/text-chunk/linkify'
import TextGroupAdapter from 'ObojoboDraft/Common/chunk/text-chunk/text-group-adapter'
import ChunkUtil from 'ObojoboDraft/Common/chunk/util/chunk-util'
import Insert from 'ObojoboDraft/Common/chunk/util/insert'
import InsertWithText from 'ObojoboDraft/Common/chunk/util/insert-with-text'
import OboComponent from 'ObojoboDraft/Common/components/obo-component'
import Anchor from 'ObojoboDraft/Common/components/anchor'
import DeleteButton from 'ObojoboDraft/Common/components/delete-button'
import EditButton from 'ObojoboDraft/Common/components/edit-button'
import Button from 'ObojoboDraft/Common/components/button'
import Bubble from 'ObojoboDraft/Common/components/modal/bubble/bubble'
import SingleInputBubble from 'ObojoboDraft/Common/components/modal/bubble/single-input-bubble'
import Question from 'ObojoboDraft/Common/components/modal/question'
import SimpleMessage from 'ObojoboDraft/Common/components/modal/simple-message'
import Modal from 'ObojoboDraft/Common/components/modal/modal'
import Dialog from 'ObojoboDraft/Common/components/modal/dialog'
import SimpleDialog from 'ObojoboDraft/Common/components/modal/simple-dialog'
import ErrorDialog from 'ObojoboDraft/Common/components/modal/error-dialog'
import TextMenu from 'ObojoboDraft/Common/components/text-menu'
import ModalContainer from 'ObojoboDraft/Common/components/modal-container'
import FocusBlocker from 'ObojoboDraft/Common/components/focus-blocker'
import FluxStore from 'ObojoboDraft/Common/flux/store'
import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher'
import MockElement from 'ObojoboDraft/Common/mockdom/mock-element'
import MockTextNode from 'ObojoboDraft/Common/mockdom/mock-text-node'
import OboModel from 'ObojoboDraft/Common/models/obo-model'
import Legacy from 'ObojoboDraft/Common/models/legacy'
import API from 'ObojoboDraft/Common/net/api'
import ChunkSelection from 'ObojoboDraft/Common/selection/chunk-selection'
import Cursor from 'ObojoboDraft/Common/selection/cursor'
import DOMSelection from 'ObojoboDraft/Common/selection/dom-selection'
import OboSelectionRect from 'ObojoboDraft/Common/selection/obo-selection-rect'
import Selection from 'ObojoboDraft/Common/selection/selection'
import VirtualCursor from 'ObojoboDraft/Common/selection/virtual-cursor'
import VirtualCursorData from 'ObojoboDraft/Common/selection/virtual-cursor-data'
import VirtualSelection from 'ObojoboDraft/Common/selection/virtual-selection'
import ModalStore from 'ObojoboDraft/Common/stores/modal-store'
import FocusStore from 'ObojoboDraft/Common/stores/focus-store'
import DOMUtil from 'ObojoboDraft/Common/page/dom-util'
import Head from 'ObojoboDraft/Common/page/head'
import Keyboard from 'ObojoboDraft/Common/page/keyboard'
import Screen from 'ObojoboDraft/Common/page/screen'
import ChunkStyleList from 'ObojoboDraft/Common/text/chunk-style-list'
import StyleableText from 'ObojoboDraft/Common/text/styleable-text'
import StyleableTextComponent from 'ObojoboDraft/Common/text/styleable-text-component'
import StyleableTextRenderer from 'ObojoboDraft/Common/text/styleable-text-renderer'
import StyleRange from 'ObojoboDraft/Common/text/style-range'
import StyleType from 'ObojoboDraft/Common/text/style-type'
import TextConstants from 'ObojoboDraft/Common/text/text-constants'
import TextGroup from 'ObojoboDraft/Common/text-group/text-group'
import TextGroupCursor from 'ObojoboDraft/Common/text-group/text-group-cursor'
import TextGroupItem from 'ObojoboDraft/Common/text-group/text-group-item'
import TextGroupSelection from 'ObojoboDraft/Common/text-group/text-group-selection'
import TextGroupUtil from 'ObojoboDraft/Common/text-group/text-group-util'
import Console from 'ObojoboDraft/Common/util/console' // @TODO
import getBackgroundImage from 'ObojoboDraft/Common/util/get-background-image'
import HtmlUtil from 'ObojoboDraft/Common/util/html-util'
import ModalUtil from 'ObojoboDraft/Common/util/modal-util'
import FocusUtil from 'ObojoboDraft/Common/util/focus-util'
import ErrorUtil from 'ObojoboDraft/Common/util/error-util'
import UUID from 'ObojoboDraft/Common/util/uuid'
import OboGlobals from 'ObojoboDraft/Common/util/obo-globals'


export default {
	Store: Store,
	chunk: {
		BaseSelectionHandler: BaseSelectionHandler,
		FocusableChunk: FocusableChunk,
		focusableChunk: {
			FocusableSelectionHandler: FocusableSelectionHandler,
			ToggleSelectionHandler: ToggleSelectionHandler
		},
		NonEditableChunk: NonEditableChunk,
		TextChunk: TextChunk,
		textChunk: {
			TextGroupSelectionHandler: TextGroupSelectionHandler,
			TextGroupEl: TextGroupEl,
			Linkify: Linkify,
			TextGroupAdapter: TextGroupAdapter
		},
		util: {
			ChunkUtil: ChunkUtil,
			Insert: Insert,
			InsertWithText: InsertWithText
		}
	},

	components: {
		OboComponent: OboComponent,
		Anchor: Anchor,
		DeleteButton: DeleteButton,
		EditButton: EditButton,
		Button: Button,
		modal: {
			bubble: {
				Bubble: Bubble,
				SingleInputBubble: SingleInputBubble
			},
			Question: Question,
			SimpleMessage: SimpleMessage,
			Modal: Modal,
			Dialog: Dialog,
			SimpleDialog: SimpleDialog,
			ErrorDialog: ErrorDialog
		},
		TextMenu: TextMenu,
		ModalContainer: ModalContainer,
		FocusBlocker: FocusBlocker
	},

	flux: {
		Store: FluxStore,
		Dispatcher: Dispatcher
	},

	mockDOM: {
		MockElement: MockElement,
		MockTextNode: MockTextNode
	},

	models: {
		OboModel: OboModel,
		Legacy: Legacy
	},

	net: {
		API: API
	},

	selection: {
		ChunkSelection: ChunkSelection,
		Cursor: Cursor,
		DOMSelection: DOMSelection,
		OboSelectionRect: OboSelectionRect,
		Selection: Selection,
		VirtualCursor: VirtualCursor,
		VirtualCursorData: VirtualCursorData,
		VirtualSelection: VirtualSelection
	},

	stores: {
		ModalStore: ModalStore,
		FocusStore: FocusStore
	},

	page: {
		DOMUtil: DOMUtil,
		Head: Head,
		Keyboard: Keyboard,
		Screen: Screen
	},

	text: {
		ChunkStyleList: ChunkStyleList,
		StyleableText: StyleableText,
		StyleableTextComponent: StyleableTextComponent,
		StyleableTextRenderer: StyleableTextRenderer,
		StyleRange: StyleRange,
		StyleType: StyleType,
		TextConstants: TextConstants
	},

	textGroup: {
		TextGroup: TextGroup,
		TextGroupCursor: TextGroupCursor,
		TextGroupItem: TextGroupItem,
		TextGroupSelection: TextGroupSelection,
		TextGroupUtil: TextGroupUtil
	},

	util: {
		Console: Console,
		getBackgroundImage: getBackgroundImage,
		HtmlUtil: HtmlUtil,
		ModalUtil: ModalUtil,
		FocusUtil: FocusUtil,
		ErrorUtil: ErrorUtil,
		UUID: UUID,
		OboGlobals: OboGlobals
	}
};
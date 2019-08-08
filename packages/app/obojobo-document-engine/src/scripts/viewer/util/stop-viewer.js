import React from 'react'
import Common from 'Common'
import APIUtil from '../../viewer/util/api-util'
import NoButtonModal from '../../common/components/modal/no-button-modal'
import sysend from 'sysend'
const { ModalUtil } = Common.util
const { Dispatcher } = Common.flux
const HEARTBEAT_DELAY = 20000
const windowId = Math.random()
let heartbeat

export const stopViewer = () => {
	stopHeartBeat()

	ModalUtil.show(
		<NoButtonModal>
			<p>
				This Obojobo module window has expired. Typically this is caused by opening this module in
				more then one window.
			</p>
		</NoButtonModal>,
		true
	)

	Dispatcher.trigger('viewer:duplicateOpen')
}

export const stopHeartBeat = () => {
	sysend.off('viewer-init')
	clearInterval(heartbeat)
}

const executeHeartBeat = draftId => {
	APIUtil.getVisitSessionStatus(draftId).then(result => {
		if (result.status !== 'ok') {
			stopViewer()
		}

		sysend.broadcast('viewer-init', { windowId, draftId })
	})
}

export const startHeartBeat = draftId => {
	clearInterval(heartbeat)
	heartbeat = setInterval(() => {
		executeHeartBeat(draftId)
	}, HEARTBEAT_DELAY)

	executeHeartBeat(draftId)

	sysend.on('viewer-init', msg => {
		// eslint-disable-next-line eqeqeq
		if (msg.windowId == windowId || msg.draftId != draftId) return
		stopViewer()
	})
}

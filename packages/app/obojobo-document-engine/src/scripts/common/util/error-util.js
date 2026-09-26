import React from 'react'

import Dispatcher from '../flux/dispatcher'
import ErrorDialog from '../components/modal/error-dialog'

const ErrorUtil = {
	show(title, errorMessage) {
		return Dispatcher.trigger('modal:show', {
			updated: {
				component: <ErrorDialog title={title}>{errorMessage}</ErrorDialog>
			}
		})
	},

	errorResponse(res) {
		const title = (() => {
			switch (res.updated.type) {
				case 'input':
					return 'Bad Input'
				case 'unexpected':
					return 'Unexpected Error'
				case 'reject':
					return 'Rejected'
			}
		})()
		return ErrorUtil.show(title, res.updated.message)
	}
}

export default ErrorUtil

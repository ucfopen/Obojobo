import React from 'react'

import Dispatcher from '../../common/flux/dispatcher'
import ErrorDialog from '../../common/components/modal/error-dialog'

const ErrorUtil = {
	show(title, errorMessage) {
		return Dispatcher.trigger('modal:show', {
			value: {
				component: <ErrorDialog title={title}>{errorMessage}</ErrorDialog>
			}
		})
	},

	errorResponse(res) {
		const title = (() => {
			switch (res.value.type) {
				case 'input':
					return 'Bad Input'
				case 'unexpected':
					return 'Unexpected Error'
				case 'reject':
					return 'Rejected'
			}
		})()

		return ErrorUtil.show(title, res.value.message)
	}
}

export default ErrorUtil

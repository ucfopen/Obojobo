import Dispatcher from 'ObojoboDraft/Common/flux/dispatcher';
import ErrorDialog from 'ObojoboDraft/Common/components/modal/error-dialog';

var ErrorUtil = {
	show(title, errorMessage) {
		return Dispatcher.trigger('modal:show', {
			value: {
				component: <ErrorDialog title={title}>{errorMessage}</ErrorDialog>
			}
		}
		);
	},

	errorResponse(res) {
		let title = (() => { switch (res.value.type) {
			case 'input': return 'Bad Input';
			case 'unexpected': return 'Unexpected Error';
			case 'reject': return 'Rejected';
		} })();

		return ErrorUtil.show(title, res.value.message);
	}
};


export default ErrorUtil;
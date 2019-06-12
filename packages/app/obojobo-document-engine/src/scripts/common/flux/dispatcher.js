import Backbone from 'backbone'

const Dispatcher = Backbone.Events

export default Dispatcher

/*
import Backbone from 'backbone'

const Dispatcher = Backbone.Events

const on = Dispatcher.on
const trigger = Dispatcher.trigger
Dispatcher.on = (...args) => {
	console.log('on', args)
	return on(...args)
}
Dispatcher.trigger = (...args) => {
	console.log('trigger', args)
	return trigger(...args)
}

export default Dispatcher

*/

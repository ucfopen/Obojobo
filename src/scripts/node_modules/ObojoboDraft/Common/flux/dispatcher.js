// Dispatcher = require('flux').Dispatcher
// module.exports = new Dispatcher()

let Dispatcher = {};
_.extend(Dispatcher, Backbone.Events);

let ex = Dispatcher.on;
let ex2 = Dispatcher.trigger;
Dispatcher.on = function() {
	// console.log 'ON', arguments
	return ex.apply(this, arguments);
};

Dispatcher.trigger = function() {
	// console.log 'TRIGGER', arguments
	return ex2.apply(this, arguments);
};

window.__dispatcher = Dispatcher;

export default Dispatcher;

export default {
	__debug__hijackConsole: () => {
		// console.time = ->
		// console.timeEnd = ->
		// console.log = ->

		console._log = console.log
		console._times = {}
		console._interval = null
		console.time = function(s) {
			if (!console._times[s]) {
				console._times[s] = {
					time: 0,
					count: 0,
					start: 0,
					avg: 0
				}
			}

			return (console._times[s].start = performance.now())
		}

		console.timeEnd = function(s) {
			if (console._times[s] != null) {
				let diff = performance.now() - console._times[s].start
				console._times[s].count++
				console._times[s].time += diff
				console._times[s].avg = (console._times[s].time / console._times[s].count).toFixed(3)
			}
			// console._log('%c' + s + ': ' + diff.toFixed(3) + 'ms (Avg: ' + console._times[s].avg + 'ms)', 'color: gray;');

			clearTimeout(console._interval)
			return (console._interval = setTimeout(console.showTimeAverages, 1000))
		}
		// console.showTimeAverages()

		console.showTimeAverages = function() {
			let byTime = []
			for (let s in console._times) {
				byTime.push({ s, avg: console._times[s].avg })
			}

			byTime.sort(function(a, b) {
				if (a.avg < b.avg) {
					return 1
				}
				if (a.avg > b.avg) {
					return -1
				}
				return 0
			})

			for (let o of Array.from(byTime)) {
				console._log(`%c${o.avg}: ${o.s}`, 'color: blue;')
				return
			} //@Todo - hack to only show worst thing
		}

		// console._error = console.error
		// console.error = (msg) ->
		// 	if msg.substr(0, 7) is 'Warning'
		// 		if msg.indexOf('Warning: bind()') > -1 or msg.indexOf('contentEditable') > -1 then return false
		// 		console.warn msg #@TODO - SUPRESS WARNINGS
		// 		# false
		// 	else
		// 		console._error msg
	}
}

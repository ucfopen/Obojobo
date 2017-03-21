module.exports = ->
	#https://gist.github.com/jed/982883
	getId = (a) -> if a then (a^Math.random()*16>>a/4).toString(16) else ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,getId)
	getId()
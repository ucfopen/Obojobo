const cloneProps = (targetToAddPropsTo, sourceToCopyPropsFrom, props) => {
	for (const prop of props) {
		targetToAddPropsTo[prop] = sourceToCopyPropsFrom[prop]
	}
}

module.exports = cloneProps

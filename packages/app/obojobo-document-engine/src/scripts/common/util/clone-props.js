export default (targetToAddPropsTo, sourceToCopyPropsFrom, props) => {
	for (const prop of props) {
		targetToAddPropsTo[prop] = sourceToCopyPropsFrom[prop]
	}
}

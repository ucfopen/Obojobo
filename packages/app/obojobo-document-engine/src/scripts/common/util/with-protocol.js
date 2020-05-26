const withProtocol = src => {
	src = '' + src

	const lcSrc = src.toLowerCase()
	if (
		!(
			lcSrc.indexOf('http://') === 0 ||
			lcSrc.indexOf('https://') === 0 ||
			lcSrc.indexOf('//') === 0
		)
	) {
		src = '//' + src
	}

	return src
}

export default withProtocol

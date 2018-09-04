let resolveIP = req => {
	// make sure the remoteAddress is set behind a load balancer
	if (req.headers['x-forwarded-for']) {
		req.connection.remoteAddress = req.headers['x-forwarded-for']
	}
}

let resolveSecure = req => {
	// if we're behind a load balancer or something
	if (req.headers['x-forwarded-proto'] === 'https') {
		req.connection.encrypted = true
	}
}

let resovleHost = req => {
	// if we're behind a load balancer or something
	if (req.headers['x-host']) {
		req.headers.host = req.headers['x-host']
	}
}

module.exports = (req, res, next) => {
	resolveIP(req)
	resolveSecure(req)
	resovleHost(req)
	next()
}

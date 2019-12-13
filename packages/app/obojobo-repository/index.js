module.exports = {
	obojobo: {
		migrations: 'server/migrations',
		expressMiddleware: 'server/index.js',
		clientScripts: {
			repository: [
				'shared/components/pages/page-library.jsx',
				'shared/components/pages/page-module.jsx'
			],
			dashboard: 'shared/components/pages/page-dashboard-client.jsx',
			homepage: 'shared/components/pages/page-homepage.jsx',
			['page-module']: 'shared/components/pages/page-module-client.jsx'
		}
	}
}

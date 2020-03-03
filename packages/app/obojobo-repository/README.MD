## Obojobo Repository

This package is part of Obojobo. Documentation can be found at https://ucfopen.github.io/Obojobo-Docs/.

This package is intended to provide:

* Homepage
* Module collections
* Module permissions
* Webpages to view public info about modules and collections
* Dashboard to manage modules
* Nice hhtp error pages


## Folder Structure

### Client

All javascript files built for the client use Obojobo's 'clientScripts' mechanism to register files to be processed by webpack.

### Server

* `/server/migrations` - Db migrations. Made discoverable by `index.js`'s `migrations` propterty.
* `/server/models` - Server side models
* `/server/public` - Static public directory for the server
* `/server/routes` - Express.js routes
* `/server/events.js` - Event listeners that allow the repository to respond to things happening in other packages
* `/server/index.js` - main express.js entry point

### Shared

* `/shared/actions/` - Redux actions
* `/shared/components` - React components used for server and client rendering
* `/shared/reducers/` - Redux Reducers



## Obojobo Module Selector

This package is part of Obojobo. Documentation can be found at https://ucfopen.github.io/Obojobo-Docs/.

This package is intended to the module selection interface used to quickly find and embed an obojobo module in a course via LTI:


## Folder Structure

### Client

All javascript files built for the client use Obojobo's 'clientScripts' mechanism to register files to be processed by webpack.

### Server

* `/server/public` - Static public directory for the server
* `/server/routes` - Express.js routes
* `/server/events.js` - Event listeners that allow the repository to respond to things happening in other packages
* `/server/index.js` - main express.js entry point

### Shared

* `/shared/actions/` - Redux actions
* `/shared/components` - React components used for server and client rendering
* `/shared/reducers/` - Redux Reducers



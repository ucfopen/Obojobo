import Page from './page';

class PageCollection extends Backbone.Collection {
	static initClass() {
		this.prototype.model = Page;
	}
}
PageCollection.initClass();


export default PageCollection;
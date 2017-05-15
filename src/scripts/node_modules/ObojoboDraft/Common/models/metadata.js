class Metadata extends Backbone.Model {
	static initClass() {
		// urlRoot: "/api/metadata"
		this.prototype.idAttribute = "shortId";
		this.prototype.defaults = {
			title: 'untitled',
			synopsis: '',
			published: false,
			rating: 0,
			ratingCount: 0,
			derivedFrom: null,
			createdAt: '',
			updatedAt: ''
		};
	}

	toJSON() {
		// shortId: @shortId
		return {
			title: this.title,
			sysnopsis: this.sysnopsis,
			published: this.published,
			rating: this.rating,
			ratingCount: this.ratingCount,
			derivedFrom: this.derivedFrom,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		};
	}
}
Metadata.initClass();


export default Metadata;
Backbone = require 'backbone'


class Metadata extends Backbone.Model
	# urlRoot: "/api/metadata"
	idAttribute: "shortId"
	defaults:
		title: 'untitled'
		synopsis: ''
		published: false
		rating: 0
		ratingCount: 0
		derivedFrom: null
		createdAt: ''
		updatedAt: ''

	toJSON: ->
		# shortId: @shortId
		title: @title
		sysnopsis: @sysnopsis
		published: @published
		rating: @rating
		ratingCount: @ratingCount
		derivedFrom: @derivedFrom
		createdAt: @createdAt
		updatedAt: @updatedAt


module.exports = Metadata
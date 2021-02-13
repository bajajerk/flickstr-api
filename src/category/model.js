const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const movieMapping = new mongoose.Schema({
	bingy_id: {
		type: String,
		required: true
	},
	jw_entity_id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	}
});

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	},
	imageUrl: {
		type: String
	},
	movies: {
		type: [movieMapping]
	},
	ranking: {
		type: Number,
		required: 1
	}
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;

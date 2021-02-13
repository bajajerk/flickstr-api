const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const movieMapping = new mongoose.Schema({
	bingy_id: {
		type: String
	}
});

const actorSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	person_id_jw: {
		type: String,
		required: true,
		unique: true
	},
	imageUrl: {
		type: String,
		default:
			"https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg"
	},
	movies: {
		type: [movieMapping]
	}
});

const actorModel = mongoose.model("Actor", actorSchema);
module.exports = actorModel;

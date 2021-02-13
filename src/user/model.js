const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	profilePicture: {
		type: String,
		default:
			"https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg"
	},
	gender: { type: String, default: "" },
	watchList: [],
	wishList: [],
	clicks: [],
	searches: [],
	mylist: [],

	//to track users activity, updated on init call
	loginDates: { type: [Date] }
});
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

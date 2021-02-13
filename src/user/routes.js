const express = require("express");
const router = express.Router();
const path = require("path");
const { auth } = require("../middleware");
const { jwt, response } = require("../helpers");
const User = require("./model");

async function getUser(req, res) {
	try {
		const user = await User.findById(req.user._id);
		let apiResponse = response.createResponse({ user }, 200);
		return res.json(apiResponse);
	} catch (err) {
		throw new Error(err);
	}
}

async function updateUserData(req, res) {
	try {
		const fieldToUpdate = req.query.type;
		const dataToUpdate = req.body.data;
		
		if (fieldToUpdate === "click") {
			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { clicks: dataToUpdate }
			});
		} else if (fieldToUpdate === "search") {
			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { searches: dataToUpdate }
			});
		} else if (fieldToUpdate === "watchlist") {
			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { watchList: dataToUpdate }
			});
		} else if (fieldToUpdate === "wishlist") {
			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { wishList: dataToUpdate }
			});
		}
		else if (fieldToUpdate === "myList") {
			await User.findByIdAndUpdate(req.user._id, {
				$addToSet: { myList: dataToUpdate }
			});
		}
		let apiResponse = response.createResponse(false, 201);
		return res.json(apiResponse);
	} catch (err) {
		throw new Error(err);
	}
}

// user routes
router.get("/", auth.authenticate(["jwt"], { session: false }), getUser);
router.post(
	"/update",
	auth.authenticate(["jwt"], { session: false }),
	updateUserData
);

module.exports = router;

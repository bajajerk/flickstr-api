const express = require("express");
const router = express.Router();
const Category = require("../category/model");
const Movie = require("../movies/model");
const { response } = require("../helpers");
router.get("/content", async function(req, res) {
	let contentType = req.query.type;
	let objectType;
	if (!contentType) {
		const apiResponse = response.createResponse(false, 400, false, false, {
			msg: "bad request"
		});
		return res.json(apiResponse);
	}
	if (contentType === "movie") {
		objectType = ["movie"];
	} else if (contentType === "show") {
		objectType = ["show_season", "show"];
	}
	let categories = await Category.find({ active: true }).limit(10);
	let bingy_ids = [];
	categories.map(category => {
		category.movies.map(movie => {
			bingy_ids.push(movie.bingy_id);
		});
	});
	let moviesDb = await Movie.find(
		{
			bingy_id: { $in: bingy_ids },
			object_type: { $in: objectType }
		},
		{ title: 1, bingy_id: 1, original_release_year: 1, poster: 1 }
	);

	let finalCategories = [];
	categories.map(category => {
		let finalCategory = {};
		finalCategory.name = category.name;
		finalCategory.imageUrl = "https://img.reelgood.com/collections/curated/imdbs-best-rated-movies/movie/card@1x.jpg";
		finalCategory.items = [];
		category.movies.map(movie => {
			moviesDb.map(movieDb => {
				if (movieDb.bingy_id === movie.bingy_id) {
					finalCategory.items.push(movieDb);
				}
			});
		});
		finalCategory.items = finalCategory.items.map(item => {
			const id = item.poster.split("/")[2];
			let url = "https://images.justwatch.com/poster/" + id + "/s166";
			return {
				...item._doc,
				poster: url
			};
		});
		finalCategories.push(finalCategory);
		// remove empty categories
		finalCategories = finalCategories.filter(cat => {
			return cat.items.length > 0;
		});
	});
	const apiResponse = response.createResponse(
		{ categories: finalCategories },
		200
	);
	return res.json(apiResponse);
});


router.get("/androidApp", async function(req, res) {
	let categories = await Category.find({ active: true }).limit(10);
	let bingy_ids = [];
	categories.map(category => {
		category.movies.map(movie => {
			bingy_ids.push(movie.bingy_id);
		});
	});
	let moviesDb = await Movie.find(
		{
			bingy_id: { $in: bingy_ids }
		},
		{ title: 1, bingy_id: 1, original_release_year: 1, poster: 1 }
	);

	let finalCategories = [];
	categories.map(category => {
		let finalCategory = {};
		finalCategory.name = category.name;
		finalCategory.imageUrl = "https://img.reelgood.com/collections/curated/imdbs-best-rated-movies/movie/card@1x.jpg";
		finalCategory.items = [];
		category.movies.map(movie => {
			moviesDb.map(movieDb => {
				if (movieDb.bingy_id === movie.bingy_id) {
					finalCategory.items.push(movieDb);
				}
			});
		});
		finalCategory.items = finalCategory.items.map(item => {
			const id = item.poster.split("/")[2];
			let url = "https://images.justwatch.com/poster/" + id + "/s166";
			return {
				...item._doc,
				poster: url
			};
		});
		finalCategories.push(finalCategory);
		// remove empty categories
		finalCategories = finalCategories.filter(cat => {
			return cat.items.length > 0;
		});
	});
	const apiResponse = response.createResponse(
		{ categories: finalCategories },
		200
	);
	return res.json(apiResponse);
});

module.exports = router;

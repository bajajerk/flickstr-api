const Category = require("../category/model");
const Movie = require("../movies/model");

// await fillMove

const fillMovies = async id => {
	const movies = await Movie.find({}).limit(15);
	console.log(movies.length);
	let bingyIds = [];
	movies.forEach(function(movie) {
		bingyIds.push(movie);
	});
	const category = await Category.findByIdAndUpdate(
		id,
		{
			$addToSet: {
				movies: bingyIds
			}
		},
		{ new: true }
	);
};

fillMovies("5e0c99a8628ecae313371550");

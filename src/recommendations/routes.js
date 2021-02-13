const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Recommendation = require("./model");
const Movie = require("../movies/model");
const {response, moviesHelper} = require("../helpers");

router.post("/", async function (req, res) {
    try {
        let recommendation = await Recommendation.create(req.body);
        res.send(recommendation);
    } catch (e) {
        throw new Error(err);
    }
});

// router.get("/:recommendation_bingy_id", async function (req, res) {
//     try {
//         const {recommendation_bingy_id} = req.params
//         let recommendation = await Recommendation.findOne({recommendation_bingy_id});
//         const movieRecommendationIds = [];
//         recommendation.match1.map(movie => movieRecommendationIds.push(movie.recommendation_bingy_id));
//         recommendation.match2.map(movie => movieRecommendationIds.push(movie.recommendation_bingy_id));
//         recommendation.match3.map(movie => movieRecommendationIds.push(movie.recommendation_bingy_id));
//
//         let moviesDb = await Movie.find(
//             {recommendation_bingy_id: {$in: movieRecommendationIds}},
//             {bingy_id: 1, recommendation_bingy_id: 1, title: 1, object_type: 1, poster: 1,}
//         )
//
//         moviesDb = moviesHelper.fixPosterLinkForMovies(moviesDb);
//         const orderedMovieResponse = [];
//         recommendation.match1.map(movie => {
//             orderedMovieResponse.push(
//                 _.find(moviesDb, {'recommendation_bingy_id': movie.recommendation_bingy_id})
//             )
//         });
//         recommendation.match2.map(movie => {
//             orderedMovieResponse.push(
//                 _.find(moviesDb, {'recommendation_bingy_id': movie.recommendation_bingy_id})
//             )
//         });
//         recommendation.match3.map(movie => {
//             orderedMovieResponse.push(
//                 _.find(moviesDb, {'recommendation_bingy_id': movie.recommendation_bingy_id})
//             )
//         });
//         const apiResponse = response.createResponse({movies: orderedMovieResponse}, 200);
//         return res.json(apiResponse);
//     } catch (err) {
//         throw new Error(err);
//     }
// });


router.get("/:recommendation_bingy_id", async function (req, res) {
    try {
        let movie = await Movie.findOne({
            recommendation_bingy_id: req.params.recommendation_bingy_id
        });
        if (!movie) {
            const apiResponse = response.createResponse({movies: []}, 200);
            return res.json(apiResponse);
        }
        // const movieDirector = moviesHelper.fetchMovieDirector(movie._doc).name;
        const movieCredits = moviesHelper.fetchCreditNames(movie._doc.credits);
        // console.log(movieCredits);
        // console.log(movieDirector)
        // console.log(movie.genre_mapping)
        const tmdb_popularity = parseInt(movie.tmdb_popularity);
        const original_release_year = parseInt(movie.original_release_year);
        let recommendations = await Movie.find({
            tmdb_popularity: {$gt: tmdb_popularity - 2, $lt: tmdb_popularity + 2},
            object_type: movie.object_type,
            // original_release_year: {$gt: original_release_year - 7, $lt: original_release_year + 7},
            $or: [
                {'genre_mapping': movie.genre_mapping},
                {"object_type": movie.object_type},
                {"credits.name": movieCredits},
            ]
        }, {title: 1, genre_mapping: 1, tmdb_popularity: 1, poster: 1, credits: 1, bingy_id: 1});
        recommendations = moviesHelper.recommendationAlgo(recommendations, movie._doc)
        const apiResponse = response.createResponse({movies: recommendations}, 200);
        return res.json(apiResponse);
    } catch (e) {
        console.log(e)
    }
})
module.exports = router;

const express = require("express");
const _ = require("lodash");
const router = express.Router();
const Movie = require("./model");
const {response, moviesHelper, omdbAPISearch} = require("../helpers");

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

router.post("/add", async function (req, res) {
    try {
        let movie = req.body;
        movie.recommendation_bingy_id = movie.bingy_id;
        movie.jw_Id = req.body.id;
        movie.bingy_id =
            Math.ceil(new Date().getTime()).toString(36) +
            Math.random()
                .toString(36)
                .slice(-2);

        movie = new Movie(movie);
        console.log(movie)
        await movie.save();
        res.send("Saved");

        // let prevMovie = await Movie.findOne({
        //     jw_Id: movie.id,
        //     runtime: movie.runtime
        // });
        //
        // if (!prevMovie) {
        //     console.log("NEW HAI");
        //     movie = new Movie(movie);
        //     movie.jw_Id = req.body.id;
        //     await movie.save();
        //     res.send("Saved");
        // } else {
        //     console.log("OLD HAI");
        //
        //     if (prevMovie.offers && prevMovie.offers.length > 0) {
        //         movie.offers.map(offer => {
        //             const prevOfferExists = _.find(prevMovie.offers, {
        //                 provider_id: offer.provider_id.toString()
        //             });
        //             if (prevOfferExists == null) {
        //                 prevMovie.offers.push(offer);
        //             }
        //         });
        //     } else {
        //         prevMovie.offers = movie.offers;
        //     }
        //     console.log(prevMovie.offers.length);
        //     await prevMovie.save();
        //     res.send("Updated ");
        // }
    } catch (e) {
        console.log(req.body);
        res.send("Failed");
    }
});

router.get("/:id", async function (req, res) {
    if (!req.params.id) {
        return res.json(response.createResponse({}, 400, false, false, true));
    }
    let movie = await Movie.findOne({
        bingy_id: req.params.id
    });

    if (movie) {
        movie.offers = moviesHelper.eliminateMultipleOffersFromSingleProvider(movie.offers);
        movie = moviesHelper.fixPosterLinkForAMovie(movie);
        return res.json(response.createResponse({entity: movie}));
    }
    if (!movie) {
        movie = await omdbAPISearch.fetchMoviePageFromOMDB(req.params.id);
        if (!movie)
            return res.json(response.createResponse({}, 404, false, false, true));
        else
            return res.json(response.createResponse({entity: movie}));

    }
});

router.get("/actor/:id/:starName/:pageNumber?", async function (req, res) {
    console.log(req.params)
    if (!req.params.id || !req.params.starName) {
        return res.json(response.createResponse({}, 400, false, false, true));
    }
    const pageNumber = req.params.pageNumber || 1;
    var movies = await Movie.find(
        {
            "credits.person_id": req.params.id,
        },
        {
            title: 1,
            jw_Id: 1,
            bingy_id: 1,
            poster: 1,
            original_release_year: 1,
            short_description: 1,
            offers: 1,
            scoring: 1
        })
        .sort({original_release_year: -1})
        .limit(12)
        .skip((pageNumber - 1) * 12);
    movies = movies.map(movie => {
        let tomatoRating, imdbRating = null;
        const id = movie.poster.split("/")[2];
        const url = "https://images.justwatch.com/poster/" + id + "/s332";
        movie.scoring.map(score => {
            if (score.provider_type === 'tomato:meter') tomatoRating = score.value;
            else if (score.provider_type === 'imdb:score') imdbRating = score.value;
        });
        movie.poster = url;
        return {
            ...movie._doc,
            poster: url,
            tomatoRating,
            imdbRating
        }
    })

    const starImageUrl = await moviesHelper.fetchStarImageFromName(req.params.starName);
    return res.json(response.createResponse({
        movies, profile: {
            name: req.params.starName,
            imageUrl: starImageUrl
        }
    }));
});

module.exports = router;

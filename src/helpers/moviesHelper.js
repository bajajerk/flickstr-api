const axios = require("axios");
const _ = require('lodash');

async function fetchStarImageFromMovieAndPersonId(movie, person_id) {
    try {
        const starOrignalName = movie.credits.find(credit => credit.person_id === person_id).name;
        if (starOrignalName) {
            const image_url_resp = await axios.get(
                "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=" + starOrignalName.replace(/ /g, "_"));
            return image_url_resp.data.query.pages[Object.keys(image_url_resp.data.query.pages)[0]].original.source
        } else {
            return "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg"
        }

    } catch (e) {
        console.log(e)
        return "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg"
    }
}

async function fetchStarImageFromName(starName) {
    try {
        const image_url_resp = await axios.get(
            "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=" + starName.replace(/ /g, "_"));
        console.log(image_url_resp.data.query.pages[Object.keys(image_url_resp.data.query.pages)[0]].original.source)
        return image_url_resp.data.query.pages[Object.keys(image_url_resp.data.query.pages)[0]].original.source
    } catch (e) {
        return "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg"
    }
}

function fixPosterLinkForAMovie(movie) {
    if (!movie._doc.poster) {
        return {
            ...movie._doc,
            poster: "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg",
            landscapePoster: "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg"
        }
    }
    const posterId = movie._doc.poster.split("/")[2];
    let landScapeId = null;
    // @TODO handle error
    if (movie._doc.backdrops && movie._doc.backdrops.length > 0) {
        landScapeId = movie._doc.backdrops[0].backdrop_url.split("/")[2];
    }
    return {
        ...movie._doc,
        poster: "https://images.justwatch.com/poster/" + posterId + "/s166",
        landscapePoster: "https://images.justwatch.com/backdrop/" + landScapeId + "/s1920"
    }
}


function fixPosterLinkForAMovieRecommendationJson(poster) {
    // console.log(poster)
    if (!poster) {
        return "https://res.cloudinary.com/teachzy-images/image/upload/v1585487709/Bingy%20Avatar/noimageAvatar_h0nc1k.jpg"
    }
    const posterId = poster.split("/")[2];
    let posterLink = "https://images.justwatch.com/poster/" + posterId + "/s166"
    return posterLink;
}

function fixPosterLinkForMovies(movies) {
    return movies.map(movie => {
        return fixPosterLinkForAMovie(movie, true)
    })
}

function eliminateMultipleOffersFromSingleProvider(offers) {
    return _.uniqBy(offers, function (e) {
        return e.provider_id;
    });
}

// function fetchMovieDirector(movie) {
// //     return movie.credits[0];
// //     // return movie.credits.find(credit => credit.role === 'DIRECTOR')
// // }

function fetchCreditNames(credits) {
    const creditsArray = [];
    credits.map(credit => creditsArray.push(credit.name));
    return creditsArray;
}


function recommendationAlgo(movies, parentMovie) {
    let recommendedMovies = movies.map(movie => {
        // if (movie.title === parentMovie.title) {
        //     return;
        // }
        let score = 0;
        movie.genre_mapping.map(genre => {
            if (parentMovie.genre_mapping.includes(genre)) {
                score = score + 2;
            }
        })

        movie.credits.map(credit => {
            if (_.find(parentMovie.credits, {person_id: credit.person_id}) != null) {
                score++;
            }
        })

        return {
            title: movie.title,
            recommendationScore: score,
            bingy_id: movie.bingy_id,
            // recommendation_bingy_id: movie.recommendation_bingy_id,
            object_type: movie.object_type,
            poster: fixPosterLinkForAMovieRecommendationJson(movie.poster)
        }
    })
    recommendedMovies = _.sortBy(recommendedMovies, ['recommendationScore']).reverse().slice(0, 20);
    return recommendedMovies;
}

exports.fetchStarImageFromMovieAndPersonId = fetchStarImageFromMovieAndPersonId;
exports.fetchStarImageFromName = fetchStarImageFromName;
exports.fixPosterLinkForMovies = fixPosterLinkForMovies;
exports.fixPosterLinkForAMovie = fixPosterLinkForAMovie;
exports.eliminateMultipleOffersFromSingleProvider = eliminateMultipleOffersFromSingleProvider;
// exports.fetchMovieDirector = fetchMovieDirector;
exports.fetchCreditNames = fetchCreditNames;
exports.recommendationAlgo = recommendationAlgo;

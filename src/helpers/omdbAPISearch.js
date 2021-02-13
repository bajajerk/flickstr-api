const axios = require("axios");
const _ = require('lodash');

async function fetchContentFromOMDB(name, oldResp) {
    try {
        let resp = await axios.get("http://www.omdbapi.com/?s=" + name + "&plot=full&apikey=6b0655e2");

        let omdbMovies = [];
        let omdbShows = [];
        if (resp.data.Response && resp.data.Response === "False") {
            return {
                omdbMovies,
                omdbShows
            }
        }
        const {Search} = resp.data;
        Search && Search.map(offering => {
            if (offering.Type === 'movie' &&
                (oldResp.movies.length === 0 || _.find(oldResp.movies, {"title": offering.Title}) === null) &&
                offering.Poster !== "N/A") {
                omdbMovies.push({
                    _id: offering.imdbID,
                    title: offering.Title,
                    poster: offering.Poster,
                    original_release_year: offering.Year,
                    bingy_id: offering.imdbID
                })
            } else if (offering.Type !== 'movie' &&
                (oldResp.shows.length === 0 || _.find(oldResp.shows, {"title": offering.Title}) === null) &&
                offering.Poster !== "N/A") {
                omdbShows.push({
                    _id: offering.imdbID,
                    title: offering.Title,
                    poster: offering.Poster,
                    original_release_year: offering.Year,
                    bingy_id: offering.imdbID
                })
            }
        })
        return {
            omdbMovies, omdbShows
        }

    } catch (e) {
        return {
            omdbMovies: [],
            omdbShows: []
        }
    }
}

async function fetchMoviePageFromOMDB(imdbId) {
    try {
        let resp = await axios.get("http://www.omdbapi.com/?i=" + imdbId + "&plot=full&apikey=6b0655e2");
        if(resp.data && resp.data.Title){
            const {data} = resp;
            const movie = {
                title: data.Title,
                bingy_id: data.imdbID,
                original_title: data.Title,
                poster: data.Poster,
                short_description: data.Plot,
                object_type: data.Type,
                runtime: data.Runtime,
                tmdb_popularity: data.imdbRating,
                original_release_year: data.Year,
                offers: [],
                scoring: [],
                credits: [],
                backdrops: [],
                episodes: [],
                external_ids: [],
                seasons: [],
                recommendation_bingy_id: null,
                genre_mapping: data.Genre.split(", ")
            }
            console.log(movie)
            return movie
        }
    }
    catch (e) {
        return null
    }
}

// fetchMoviePageFromOMDB("tt1324059");


exports.fetchContentFromOMDB = fetchContentFromOMDB;
exports.fetchMoviePageFromOMDB = fetchMoviePageFromOMDB;

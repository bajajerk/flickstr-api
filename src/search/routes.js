const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { response, moviesHelper, omdbAPISearch } = require("../helpers");
const Movie = require("../movies/model");

function search(req, res) {
  console.log(req.query);
  const query = req.query.q;
  const PageNumber = req.query.p;
  const pageSize = 5;
  const skips = pageSize * (PageNumber - 1);
  const movieResults = Movie.find({
    title: { $regex: `${query}`, $options: "i" },
    object_type: "movie"
  })
    .skip(skips)
    .limit(pageSize);
  const showResults = Movie.find({
    title: { $regex: `${query}`, $options: "i" },
    object_type: { $in: ["show_season", "show"] }
  })
    .skip(skips)
    .limit(pageSize);
  Promise.all([movieResults, showResults]).then(data => {
    const apiResponse = response.createResponse(
        { movies: moviesHelper.fixPosterLinkForMovies(data[0]), shows: moviesHelper.fixPosterLinkForMovies(data[1])},
      200
    );
    return res.json(apiResponse);
  });
}

function typeAhead(req, res) {
  console.log(req.query);
  const query = req.query.q;
  const PageNumber = req.query.p;
  const pageSize = 5;
  const skips = pageSize * (PageNumber - 1);
  const fields = { title: 1, original_release_year: 1, poster: 1, bingy_id: 1 };
  const movieResultsPromise = Movie.find({
    title: { $regex: `${query}`, $options: "i" },
    object_type: "movie"
  })
    .skip(skips)
    .limit(pageSize)
    .select(fields);
  const showResultsPromise = Movie.find({
    title: { $regex: `${query}`, $options: "i" },
    object_type: { $in: ["show_season", "show"] }
  })
    .skip(skips)
    .limit(pageSize)
    .select(fields);
  Promise.all([movieResultsPromise, showResultsPromise]).then(data => {
    console.log(data)
    let movies = moviesHelper.fixPosterLinkForMovies(data[0]);
    let shows = moviesHelper.fixPosterLinkForMovies(data[1]);
    omdbAPISearch.fetchContentFromOMDB(query, {movies, shows}).then(omdbResp=> {
      const apiResponse = response.createResponse(
          { movies: movies.concat(omdbResp.omdbMovies), shows: shows.concat(omdbResp.omdbShows)},
          200
      );
      return res.json(apiResponse);
    })
  });
}

router.get("/dashboard", async function(req, res) {
  console.log(req.query, "CHECK");
  const query = req.query.q;

  // @TODO projection fix
  const results = await Movie.find(
    {
      title: { $regex: `${query}`, $options: "i" }
    },
    { title: 1, bingy_id: 1, jw_entity_id: 1 }
  );
  const apiResponse = response.createResponse({ results }, 200);
  return res.json(apiResponse);
});

router.get("/", search);
router.get("/autocomplete", typeAhead);

module.exports = router;

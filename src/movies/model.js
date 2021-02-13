const mongoose = require("mongoose");

const movieOfferSchema = new mongoose.Schema({
    monetization_type: {
        type: String
    },
    provider_id: {
        type: String
    },
    currency: {
        type: String
    },
    presentation_type: {
        type: String
    },
    date_provider_id: {
        type: String
    },
    date_created: {
        type: String
    },
    retail_price: {
        type: String
    },
    urls: {
        type: JSON
    }
});


const movieScoringSchema = new mongoose.Schema({
    value: {
        type: String
    },
    provider_type: {
        type: String
    }
});

const episodeSchema = new mongoose.Schema({
    runtime: {
        type: String
    },
    title: {
        type: String
    },
    episode_number: {
        type: String
    },
    object_type: {
        type: String
    },
    offers: {
        type: [movieOfferSchema]
    },
    show_title: {
        type: String
    },
    jw_entity_id: {
        type: String
    },
    season_number: {
        type: String
    }
});

const movieClipsSchema = new mongoose.Schema({
    external_id: {
        type: String
    },
    type: {
        type: String
    },
    name: {
        type: String
    },
    provider: {
        type: String
    }
});

const movieCreditsSchema = new mongoose.Schema({
    bingy_actor_id: {
        type: String
    },
    role: {
        type: String
    },
    character_name: {
        type: String
    }
});

const movieCreditsSchemaDirect = new mongoose.Schema({
    name: {
        type: String
    },
    person_id: {
        type: String
    },
    character_name: {
        type: String
    },
    role: {
        type: String
    },
    character_name: {
        type: String
    }
});


const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bingy_id: {
        type: String,
        unique: true,
        index: true
    },
    original_title: {
        type: String
    },
    poster: {
        type: String
    },
    object_type: {
        type: String
    },
    short_description: {
        type: String
    },
    runtime: {
        type: Number
    },
    jw_entity_id: {
        type: String
    },
    jw_Id: {
        type: String
    },
    tmdb_popularity: {
        type: String
    },
    original_release_year: {
        type: String
    },
    genre_ids: {
        type: [String]
    },
    clips: {
        type: [movieClipsSchema]
    },
    offers: {
        type: [movieOfferSchema]
    },
    scoring: {
        type: [movieScoringSchema]
    },
    credits: {
        type: [movieCreditsSchemaDirect]
    },
    backdrops: {
        type: []
    },
    episodes: {
        type: [episodeSchema]
    },
    external_ids: {
        type: []
    },
    seasons: {
        type: []
    },
    recommendation_bingy_id: {
        type: String
    },
	genre_mapping: {
        type: []
    },
    original_title: {
        type: String
    }
});
const movieModel = mongoose.model("Movie", movieSchema);
module.exports = movieModel;

const mongoose = require("mongoose"),
    Schema = mongoose.Schema;


const matchedSetSchema = new mongoose.Schema({
    recommendation_bingy_id: {
        type: String
    },
    score: {
        type: Number
    },
    castGenScore: {
        type: String
    },
    title: {
        type: String
    }
});

const recommendationSchema = new mongoose.Schema({
    recommendation_bingy_id: {
        type: String,
        index: true
    },
    match1: {
        type: [matchedSetSchema]
    },
    match2: {
        type: [matchedSetSchema]
    },
    match3: {
        type: [matchedSetSchema]
    }
});

const recommendationModel = mongoose.model("Recommendation", recommendationSchema);
module.exports = recommendationModel;

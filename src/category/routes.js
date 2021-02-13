const express = require("express");
const router = express.Router();
const path = require("path");
const Category = require("../category/model");
const Movie = require("../movies/model");


router.get("/", async function (req, res) {
    try {
        let categories = await Category.find({});
        res.send(categories);
    } catch (e) {
        console.log(e);
        res.send([]);
    }

});
router.post("/new", async function (req, res) {
    console.log(req.body)
    try {
        if (!req.body.name) {
            return res.send({error: "Body is empty or cant find params"});
        }

        let category = await Category.create({
            name: req.body.name,
            active: false,
            ranking: 9999
        })
        res.send(category);
    } catch (e) {
        res.send("HI");
    }

});

router.post("/toggle", async function (req, res) {
    if (!req.body._id) {
        return res.send({error: "Body is empty or cant find params"});
    }

    const category = await Category.findOneAndUpdate(
        {_id: req.body._id},
        {active: req.body.active},
        {new: true}
    );

    if (!category)
        return res
            .status(404)
            .send("The category with the given id was not found.");
    res.send(category);
});

router.post("/add", async function (req, res) {
    console.log(req.body)
    if (!req.body._id || !req.body.bingy_id || !req.body.jw_entity_id) {
        return res.send({error: "Body is empty or cant find params"});
    }

    const category = await Category.findByIdAndUpdate(
        req.body._id,
        {
            $addToSet: {
                movies: [
                    {
                        title: req.body.title,
                        bingy_id: req.body.bingy_id.toString(),
                        jw_entity_id: req.body.jw_entity_id.toString()
                    },
                ]
            }
        },
        {new: true}
    );
    console.log(category);
    if (!category)
        return res
            .status(404)
            .send("The category with the given id was not found.");
    res.send(category);
});

router.delete("/:_id", async function (req, res) {
    console.log(req.params)
    if (!req.params._id) {
        return res.send({error: "Body is empty or cant find params"});
    }

    const category = await Category.deleteOne(
        {_id: req.params._id}
    );
    res.send({"SUCCESS": true})
})


router.post("/removeMovie", async function (req, res) {
    if (!req.body._id || !req.body.bingy_id) {
        return res.send({error: "Body is empty or cant find params"});
    }
    const category = await Category.findById(
        req.body._id
    );
    category.movies = category.movies.filter(movie => movie.bingy_id !== req.body.bingy_id);
    await category.save()
    res.send(category)
})

router.post("/changeRanking", async function (req, res) {
    if (!req.body._id || !req.body.ranking) {
        return res.send({error: "Body is empty or cant find params"});
    }
    const category = await Category.findByIdAndUpdate(
        req.body._id,
        {ranking: req.body.ranking},
        {new: true}
    );
    res.send(category)
})

router.post("/bulkUploadDev", async function (req, res) {
    if (!req.body.id) {
        return res.send({error: "Body is empty or cant find params"});
    }
    const movies = await Movie.find({}).limit(15);
    let bingyIds = [];
    movies.forEach(function (movie) {
        bingyIds.push(movie);
    });
    const category = await Category.findByIdAndUpdate(
        req.body.id,
        {
            $addToSet: {
                movies: bingyIds
            }
        },
        {new: true}
    );
    if (!category)
        return res
            .status(404)
            .send("The category with the given id was not found.");
    res.send(category);
});

module.exports = router;

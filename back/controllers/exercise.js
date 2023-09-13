const Exercise = require('../models/exercise');

exports.create = async (req, res) => {
    try {
        const data = req.body;
        if (await Exercise.findOne({ title: data.title })) return res.status(400).send('That title is already taken')
        const newExercise = await Exercise.create(data);
        res.status(200).send('Created successfully: ' + newExercise);
    }
    catch (err) {
        res.status(500).send(err)
    }
}

exports.fetch = async (req, res) => {
    try {
        const { title } = req.body;
        if (title) {
            const exercise = await Exercise.findOne({ title });
            return res.status(200).send(exercise);
        }
        const allExercises = await Exercise.find({});
        return res.status(200).send(allExercises);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
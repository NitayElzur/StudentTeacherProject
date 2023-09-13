const Exercise = require('../models/exercise');

exports.create = async (req, res) => {
    try {
        const data = req.body;
        if (await Exercise.findOne({ title: data.title })) return res.status(400).send('That title is already taken')
        const newExercise = await Exercise.create(data);
        res.status(200).send('Created successfully: ' + newExercise);
    }
    catch (err) {
        res.status(500).send(err.message)
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
        res.status(500).send(err.message);
    }
}

exports.update = async (req, res) => {
    try {
        const data = req.body;
        const thisExercise = await Exercise.findOne({ title: data.title });
        if (!thisExercise) return res.status(400).send('No exercise conatining this title');
        const newExercise = await Exercise.findOneAndUpdate(
            { _id: thisExercise._id },
            { data },
            { new: true }
        )
        return res.status(200).send(newExercise);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
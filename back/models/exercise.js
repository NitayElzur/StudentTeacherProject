const { Schema, model } = require('mongoose');
const exerciseSchema = new Schema({
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    solution: { type: String, required: true }
})

module.exports = model('Exercise', exerciseSchema);
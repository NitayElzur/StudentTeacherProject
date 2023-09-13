const { Schema, model } = require('mongoose');

const testCaseSchema = new Schema({
    input: { type: Schema.Types.Mixed },
    output: { type: Schema.Types.Mixed }
})

const exerciseSchema = new Schema({
    title: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    solution: { type: String, required: true },
    testCases: [{ type: testCaseSchema }],
    hint: { type: String }
})

module.exports = model('Exercise', exerciseSchema);
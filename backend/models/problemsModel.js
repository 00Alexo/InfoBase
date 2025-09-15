const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    creator:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    uniqueId:{
        type: Number,
        required: true,
        unique: true
    },
    cerinta:{
        type: String,
        required: true,
    },
    DateDeIntrare:{
        type: String,
        required: true,
    },
    DateDeIesire:{
        type: String,
        required: true,
    },
    Restrictii:{
        type: String,
        required: false,
    },
    Precizari:{
        type: String,
        required: false,
    },
    Exemple:{
        type: [Object],
        required: true,
    },
    Teste:{
        type: [Object],
        required: true,
    },
    difficulty:{
        type: String,
        required: true,
    },
    tags:{
        type: [Object],
        required: true,
    },
    official:{
        type: Boolean,
        required: true,
    },
    accepted:{
        type: Boolean,
        required: true
    }
  }, {timestamps: true});

  const ProblemsCollection = mongoose.model("ProblemsCollection", ProblemSchema);

  module.exports = ProblemsCollection;
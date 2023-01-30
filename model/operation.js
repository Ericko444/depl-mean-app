const mongoose = require("mongoose");

const operationSchema = mongoose.Schema({
    intitule: {
        type: String
    },
    image: {
        type: String
    },
    cout: {
        type: Number
    },
    pieces: {
        type: Array
    },
    etat: {
        type: Number
    },
    courrante: {
        type: Boolean
    }
});

const Operation = (module.exports = mongoose.model("Operation", operationSchema));

module.exports = Operation;

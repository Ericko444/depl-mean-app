const mongoose = require("mongoose");

const reparationSchema = mongoose.Schema({
    voiture: {
        type: Object
    },
    dateDepot: {
        type: Date
    },
    dateRetrait: {
        type: Date
    },
    dateDebut: {
        type: Date
    },
    dateFin: {
        type: Date
    },
    description: {
        type: String
    },
    operations: {
        type: Array
    },
    paiement: {
        type: Object
    },
    bonSortie: {
        type: String
    },
    responsable: {
        type: Object
    },
    etat: {
        type: Number
    }
});

const Reparation = (module.exports = mongoose.model("Reparation", reparationSchema));

module.exports = Reparation;

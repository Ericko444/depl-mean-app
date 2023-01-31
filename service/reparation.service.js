const Reparation = require("../model/reparation");

exports.findById = (id, callback) => {
  Reparation.findById(id, callback);
};

exports.getReparations = (callback) => {
  Reparation.find({ etat : {$gte : 0}}, callback);
};

exports.getReparationsTermines = (callback) => {
  Reparation.find({ etat : {$eq : 2}}, callback);
};

exports.getNouveau = (callback) => {
  Reparation.find({ etat : {$eq : 0}}, callback);
};

exports.depot = (reparation, res) => {
  reparation.save((err, rep) => {
    if (!!err) {
      res.json({
        success: false,
        msg: `Erreur d'enregistrement: ${err}`,
      });
      throw err;
    } else {
      res.json({
        success: true,
        msg: `Voiture deposé : ${rep.toString()}`,
      });
    }
  });
};

exports.mesReparationsEnCours = (clientId, callback) => {
  if (!clientId) {
    throw new Error("client Id not found");
  }
  Reparation.find(
    {
      "voiture.proprietaire": clientId,
      dateDepot: { $exists: true },
      bonSortie: { $eq: "" },
    },
    callback
  );
};

exports.historiqueVoiture = (filter, callback) => {
  console.log(filter);
  if (!filter["voiture._id"]) {
    throw new Error("voiture Id not found");
  }
  Reparation.find(filter, callback);
};

exports.findReparations = (filter, callback) => {
  console.log('Filter',filter);
  Reparation.find(filter, callback);
}

// exports.reArrangeData = (data) => {
//   data.map((dt, index) => {
//     for (const [key, value] of Object.entries(data)) {
//       console.log(`${key} : ${Array.isArray(value)}`);
//       if (Array.isArray(value)) {
//         dt[key] = value[0];
//       }
//     }
//   });
// };

// exports.testView = (clientId, callback) => {
//   if (!clientId) {
//     throw new Error("client Id not found");
//   }

//   TestView.find({}, callback);
// };
exports.recupererVoiture = (repId, res, next) => {
  this.findById(repId, (err, reparation) => {
    if (err) {
      next(err);
    } else {
      if (!reparation.bonSortie) {
        next(`La voiture n'est pas encore prete LOL`);
      } else {
        reparation.dateRetrait = Date.now();
        Reparation.findOneAndUpdate(
          { _id: repId },
          { dateRetrait: reparation.dateRetrait }
        ).then((savedDoc) => {
          var err = {type: "success", message: "Voiture récupéré"};
          next(err);
        });
      }
    }
  });
};

exports.modifierEtat = (obj, res, next) => {
  const data = obj.body;
  const now = Date.now();;

  this.findById(data.id, (err, reparation) => {
    if (err) {
      next(err);
    } else {
      if (data.statusSelected == '1') {
        Reparation.findOneAndUpdate(
          { _id: data.id },
          { 
            etat: data.statusSelected,
            responsable: data.respSelected,
            operations: data.selectedOperations,
            dateDebut: now,
          }
        ).then((savedDoc) => {
          var ob = {type: "success", message: "Modifié"};
          next(ob);
        });
      } else if (data.statusSelected == '2'){
        Reparation.findOneAndUpdate(
          { _id: data.id },
          { 
            etat: data.statusSelected,
            responsable: data.respSelected,
            operations: data.selectedOperations,
            dateFin: now,
          }
        ).then((savedDoc) => {
          var ob = {type: "success", message: "Modifié"};
          next(ob);
        });
      }
    }
  });
};

exports.modifierEtatOnly = (obj, res, next) => {
  const data = obj.body;
  const now = Date.now();;

  this.findById(data.id, (err, reparation) => {
    if (err) {
      next(err);
    } else {
      if (data.statusSelected == '1') {
        Reparation.findOneAndUpdate(
          { _id: data.id },
          { 
            etat: data.statusSelected,
            dateDebut: now,
          }
        ).then((savedDoc) => {
          var ob = {type: "success", message: "Modifié"};
          next(ob);
        });
      } else if (data.statusSelected == '2'){
        Reparation.findOneAndUpdate(
          { _id: data.id },
          { 
            etat: data.statusSelected,
            dateFin: now,
          }
        ).then((savedDoc) => {
          var ob = {type: "success", message: "Modifié"};
          next(ob);
        });
      } else if (data.statusSelected == '0'){
        Reparation.findOneAndUpdate(
          { _id: data.id },
          { 
            etat: data.statusSelected,
            dateDebut: null,
            dateFin: null,
          }
        ).then((savedDoc) => {
          var ob = {type: "success", message: "Modifié"};
          next(ob);
        });
      }
    }
  });
};

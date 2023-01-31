const Reparation = require("../model/reparation");
const reparationService = require("../service/reparation.service");
const voitureService = require("../service/voiture.service");
const operationService = require("../service/operation.service");
const paiementService = require("../service/paiement.service");
const statistiqueService = require("../service/statistique.service");
// exports.ajouterVoiture = function(req, res, next){
//     let newCar = new Voiture({
//         marque: req.body.marque,
//         modele: req.body.modele,
//         numero: req.body.numero,
//         annee: req.body.annee,
//         proprietaire: req.user.data._id,
//         reparations: []
//     });

//     voitureService.ajouterVoiture(newCar, res);
// };

// exports.getCar = (req, res, next) => {
//     let carId = req.params.id;
//     voitureService.findById(carId, (err, car) => {
//         if(!!err){
//             res.json({ success: false, msg: "Car introuvable" });
//         }
//         else{
//             res.json({
//                 success: true,
//                 msg: 'Liste de vos voitures',
//                 data: car
//             });
//         }
//     })
// }

exports.deposerVoiture = (req, res, next) => {
  try {
    if (!!req.body) {
      var rep = new Reparation(req.body);
      reparationService.depot(rep, res);
    } else {
      res.json({ success: false, msg: "Erreur dans depot" });
    }
  } catch (err) {
    res.json({ success: false, msg: "Erreur dans depot" });
  }
};

exports.recupererVoiture = (req, res, next) => {
  let reparationId = req.body.id;
  try {
    reparationService.recupererVoiture(reparationId, res, next);
  } catch (err) {
    next(err);
    // res.json({ success: false, msg: "Erreur dans la récuperation" });
  }
};

exports.effectuerPaiement = (req, res, next) => {
  try {
    paiementService.ajouterPaiement(req.body, res, next);
  } catch (err) {
    next(err);
  }
};

exports.validerPaiement = (req, res, next) => {
  try {
    paiementService.validerPaiement(req.body.id, res, next);
  } catch (err) {
    next(err);
  }
};

exports.getReparation = (req, res, next) => {
  let reparationId = req.params.id;
  try {
    reparationService.findById(reparationId, (err, data) => {
      if (!!err) {
        next(err);
      } else {
        res.json({
          success: true,
          msg: "Réparation",
          data: data,
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.mesVoitures = (req, res, next) => {
  voitureService.findByClient(req.user.data._id, (err, data) => {
    if (err) {
      res.json({
        success: false,
        err: `Fetch error: ${err}`,
      });
      throw new Error(err);
    } else {
      res.json({
        success: true,
        msg: "Liste de vos voitures",
        data: data,
      });
    }
  });
};

exports.mesReparationsEnCours = (req, res, next) => {
  reparationService.mesReparationsEnCours(req.user.data._id, (err, data) => {
    if (err) {
      res.json({
        success: false,
        err: `Fetch error: ${err}`,
      });
      throw new Error(err);
    } else {
      res.json({
        success: true,
        msg: "Liste de vos reparations en cours",
        data: data,
      });
    }
  });
};

exports.historiqueReparation = (req, res, next) => {
  reparationService.historiqueVoiture(req.body, (err, data) => {
    if (err) {
      res.json({
        success: false,
        err: `Fetch error: ${err}`,
      });
      throw new Error(err);
    } else {
      res.json({
        success: true,
        msg: "Liste de vos reparations",
        data: data,
      });
    }
  });
};

exports.findReparation = (req, res, next) => {
  reparationService.findReparations(req.body, (err, data) => {
    if(err){
      next(`Error : `, err);
    }
    else{
      var err = {
        type: "success",
        message: "Liste des reparations",
        data: data
      }
      next(err);
    }
  })
};

// exports.getPrestations = (req, res, next) => {
//     prestationService.getPrestations(req.body, (err, data) => {
//         if(err){
//             res.json({
//                 success: false,
//                 err: `Fetch error: ${err}`,
//             });
//             throw new Error(err);
//         }
//         else{
//             res.json({
//                 success: true,
//                 msg: 'Liste des prestations',
//                 data: data
//             });
//         }
//     })
// }

exports.getOperations = (req, res, next) => {
  operationService.getOperations(req.body, (err, data) => {
    if (err) {
      res.json({
        success: false,
        err: `Fetch error: ${err}`,
      });
      throw new Error(err);
    } else {
      res.json({
        success: true,
        msg: "Liste des operations",
        data: data,
      });
    }
  });
};

exports.getTempsMoyenne = (req, res, next) => {
  statistiqueService.tempsMoyenReparation(req.params.id);
}

// exports.testView = (req, res, next) => {
//     reparationService.testView(req.user.data._id, (err, data) => {
//         if(err){
//             res.json({
//                 success: false,
//                 err: `Fetch error: ${err}`,
//             });
//             throw new Error(err);
//         }
//         else{
//             res.json({
//                 success: true,
//                 msg: 'Liste de vos reparations en cours',
//                 data: data
//             });
//         }
//     });
// }

exports.getReparations = (req, res, next) => {
    reparationService.getReparations((err, data) => {
      if (err) {
        res.json({
          success: false,
          err: `Fetch error: ${err}`,
        });
        throw new Error(err);
      } else {
        res.json({
          success: true,
          msg: "Liste des reparationss",
          data: data,
        });
      }
    });
  };

  exports.modifierEtat = (obj, res, next) => {
    reparationService.modifierEtat(obj, res, next);
  };

  exports.modifierEtatOnly = (obj, res, next) => {
    reparationService.modifierEtatOnly(obj, res, next);
  };

  exports.getTermines = (req, res, next) => {
    reparationService.getReparationsTermines((err, data) => {
      if (err) {
        res.json({
          success: false,
          err: `Fetch error: ${err}`,
        });
        throw new Error(err);
      } else {
        res.json({
          success: true,
          msg: "Liste des reparationss",
          data: data,
        });
      }
    });
  };

  exports.getNouveau = (req, res, next) => {
    reparationService.getNouveau((err, data) => {
      if (err) {
        res.json({
          success: false,
          err: `Fetch error: ${err}`,
        });
        throw new Error(err);
      } else {
        res.json({
          success: true,
          msg: "Liste des reparationss",
          data: data,
        });
      }
    });
  };

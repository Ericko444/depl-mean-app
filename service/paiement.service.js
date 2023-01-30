const reparationService = require("./reparation.service");
const Reparation = require("../model/reparation");

exports.ajouterPaiement = (data, res, next) => {
  const repId = data.id;
  const detailPaiement = data.detailPaiement;
  if (!!!repId) {
    next("RepId introuvable");
  } else if (!!!detailPaiement) {
    next("detailPaiement introuvable");
  } else {
    reparationService.findById(repId, (err, rep) => {
      if (err) {
        next("ERRRORR", err);
      } else {
        if (!rep.paiement || !rep.paiement.detailPaiement.length) {
          var paiement = {
            etat: 0,
            detailPaiement: [],
          };
          paiement.detailPaiement.push(detailPaiement);
          rep.paiement = paiement;
        } else {
          var p = rep.paiement;
          p.detailPaiement.push(detailPaiement);
          rep.paiement = p;
        }
        console.log(rep.paiement);
        Reparation.findOneAndUpdate(
          { _id: repId },
          { paiement: rep.paiement }
        ).then((saved) => {
          var err = {
            type: "success",
            message: "Paiement enregistré",
            success: "true",
          };
          next(err);
        });
        // rep.save().then((data) => {
        //   next("Paiement effectué");
        // });
      }
    });
  }
};

exports.totalFacture = (reparation) => {
  var tot = 0;
  for (let i = 0; i < reparation.operations.length; i++) {
    tot += Number(reparation.operations[i].cout);
  }
  return tot;
};

exports.totalPaiement = (reparation) => {
  var tot = 0;
  for (let i = 0; i < reparation.paiement.detailPaiement.length; i++) {
    tot += Number(reparation.paiement.detailPaiement[i].montant);
  }
  return tot;
};

exports.verifyPaiement = (reparation, next, callback) => {
  console.log(this.totalFacture(reparation));
  console.log(this.totalPaiement(reparation));
  var verify = true;
  if (this.totalFacture(reparation) - this.totalPaiement(reparation) !== 0) {
    verify = false;
  } else {
    verify = true;
  }
  if (typeof callback == "function") {
    callback(verify);
  }
};

exports.validerPaiement = (repId, res, next) => {
  Reparation.findById(repId, (err, reparation) => {
    if (err) {
      next(err);
    } else {
      try {
        if (
          this.totalFacture(reparation) - this.totalPaiement(reparation) !==
          0
        ) {
          var err = { type: "error", msg: "Erreur", success: "false" };
          next(err);
        } else {
          Reparation.findOneAndUpdate(
            { _id: repId },
            { "paiement.etat": 1 }
          ).then((savedDoc) => {
            var err = {
              type: "success",
              message: "Paiement validé",
              success: "true",
            };
            next(err);
          });
        }
      } catch (err) {
        next(err);
      }
    }
  });
};

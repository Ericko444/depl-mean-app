const Reparation = require("../model/reparation");
const reparationService = require("./reparation.service");

exports.ajouterVoiture = (voiture, res) => {
  if (voiture._id) {
    voiture.save((err, v) => {
      if (err) {
        console.log("ERROR", err);
        res.json({ success: false, msg: "Erreur d'enregistrement" });
      } else {
        res.json({
          success: true,
          msg: `Voiture enregistré : ${v.toString()}`,
        });
      }
    });
  } else {
    res.json({ success: false, msg: "Erreur d'enregistrement" });
  }
};

exports.verifyDepotCar = (voiture, fn) => {
  var verify = false;
  reparationService.historiqueVoiture({ _id: voiture._id }, (err, hist) => {
    if (!!err) {
      throw new Error(`Fetch error : ${err}`);
    } else {
      for (let i = 0; i < hist.length; i++) {
        if (!!hist[i].reparation.bonSortie) {
          verify = false;
        } else {
          verify = true;
        }
      }
      if (typeof fn == "function") {
        fn(verify);
      }
    }
  });
};

// exports.deposerVoiture = (id, reparation, res) => {
//   this.findById(id, (err, voiture) => {
//     if (err) {
//       res.json({ success: false, msg: `Erreur d'enregistrement: ${err}` });
//       throw err;
//     } else if (!!this.verifyDepotCar(voiture)) {
//       console.log("Voiture en rep");
//       res.json({
//         success: false,
//         msg: `La voiture est encore en réparation: ${err}`,
//       });
//       throw err;
//     } else {
//       try {
//         this.verifyDepotCar(voiture, function snbv(param) {
//           if (!!param) {
//             res.json({
//               success: false,
//               msg: `Erreur d'enregistrement: La voiture est encore en réparation`,
//             });
//           } else {
//             for (let i = 0; i < reparation.operations.length; i++) {
//               reparation.operations[i] = mongoose.Types.ObjectId(
//                 reparation.operations[i]
//               );
//             }
//             reparation.save((err, rep) => {
//               if (!!err) {
//                 res.json({
//                   success: false,
//                   msg: `Erreur d'enregistrement: ${err}`,
//                 });
//                 throw err;
//               } else {
//                 voiture.reparations.push(rep._id);
//                 voiture.save((err, v) => {
//                   if (!!err) {
//                     res.json({
//                       success: false,
//                       msg: `Erreur d'enregistrement: ${err}`,
//                     });
//                     throw err;
//                   } else {
//                     res.json({
//                       success: true,
//                       msg: `Voiture deposé : ${v.toString()}`,
//                     });
//                   }
//                 });
//               }
//             });
//           }
//         });
//       } catch (err) {
//         res.json({
//           success: false,
//           msg: `Erreur d'enregistrement: ${err}`,
//         });
//       }
//     }
//   });
// };

exports.findByClient = (clientId, callback) => {
  if (!clientId) {
    throw new Error("client Id not found");
  }
  Reparation.distinct('voiture',{"voiture.proprietaire": clientId}, callback);
};

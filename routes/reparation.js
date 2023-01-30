const express = require("express");
const router = express.Router();

const reparationController = require('../controller/reparationController');
const { authorize } = require("../middlewares/authorize");
const { errorHandler } = require("../middlewares/errorHandler");

const Roles = {
    CLIENT: "client",
    ATELIER: "atelier",
    FINANCE: "finance",
  }

router.post('/deposerVoiture', authorize([Roles.CLIENT]), reparationController.deposerVoiture);
router.get('/mesReparationsEnCours', authorize([Roles.CLIENT]), reparationController.mesReparationsEnCours);
router.get('/mesVoitures', authorize([Roles.CLIENT]), reparationController.mesVoitures);
// router.put('/deposerVoiture/:id', authorize([Roles.CLIENT]), reparationController.deposerVoiture);
// router.get('/getCar/:id', authorize([Roles.CLIENT]), reparationController.getCar);
router.get('',reparationController.getReparations);
router.put('/modifierEtat',reparationController.modifierEtat);
router.get('/detail/:id', authorize([Roles.CLIENT]), reparationController.getReparation);
router.post('/paiement', authorize([Roles.CLIENT]), reparationController.effectuerPaiement);
router.put('/validerPaiement', authorize([Roles.FINANCE]), reparationController.validerPaiement);
router.post('/getReparations', authorize([Roles.CLIENT, Roles.FINANCE, Roles.ATELIER]), reparationController.findReparation);
// router.put('/deposerVoiture/:id', authorize([Roles.CLIENT]), reparationController.deposerVoiture);
// router.get('/getCar/:id', authorize([Roles.CLIENT]), reparationController.getCar);
router.put('/recupererVoiture', authorize([Roles.CLIENT]), errorHandler(reparationController.recupererVoiture));
router.post('/historiqueReparation', authorize([Roles.CLIENT]), reparationController.historiqueReparation);
router.post('/operations', authorize([Roles.CLIENT, Roles.ATELIER]), reparationController.getOperations);

module.exports = router;
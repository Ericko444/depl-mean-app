const Reparation = require("../model/reparation");
const reparationService = require("../service/reparation.service");


exports.tempsMoyenReparation = (idVoiture) => {
    var query = Reparation.find({"voiture._id": idVoiture, dateDebut: {$ne: null}, dateFin: {$ne: null}});
    query.count(function (err, count) {
        if (err) console.log(err)
        else{
            Reparation.find({"voiture._id": idVoiture, dateDebut: {$ne: null}, dateFin: {$ne: null}}, ((err, data) => {
                if (err) console.log(err)
                else{
                    var dureeTotal = 0;
                    for(let i = 0; i < data.length; i++)
                    {
                        dureeTotal += Date.parse(data[i].dateFin) - Date.parse(data[i].dateDebut);
                    } 
                    const diffDays = Math.ceil((dureeTotal/count) / (1000 * 60 * 60)); 
                    console.log('TMoyenne', diffDays);
                    
                }
            }))
        }
    });
}

exports.dureeReparation = (reparation) => {
    return Math.abs(Date.parse(reparation.dateFin) - Date.parse(reparation.dateDebut));
}

exports.nombreReparationVoiture = (id) => {
    var query = Reparation.find({"voiture._id": id});
    var countRep = 0;
    query.count(function (err, count) {
        if (err) console.log(err)
        else 
            countRep = count;
            console.log("Count is", count);
    });
}
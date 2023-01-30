const Operation = require('../model/operation');


exports.filterOperations = (filter, callback) => {
    Operation.find(filter,callback);
}

exports.getOperations = (filter, callback) => {
    this.filterOperations(filter, callback);
}
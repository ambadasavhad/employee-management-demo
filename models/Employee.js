var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  salary:{
    type: Number,
    required:true
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
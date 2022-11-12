var mongoose = require("mongoose");  
var db =  
mongoose.connect('mongodb://127.0.0.1/myreactemp',{ useUnifiedTopology: true, useNewUrlParser: true }, function (err,response) { 
   if(err){ console.log('Failed to connect to ' + db); }  
   else{ console.log('Sucessfully Connected to database'); }  
});  
  
  
module.exports =db;  
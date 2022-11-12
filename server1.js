var express = require("express");  
var path = require("path");  
var mongoose = require('mongoose');   
var bodyParser = require('body-parser');   
var morgan = require("morgan");  
var db = require("./config.js");  
var ejs = require('ejs');

var app = express();  
var port = process.env.port || 8888;  
var srcpath  = path.join(__dirname,'/public') ;  
app.use(express.static('public'));  
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({extended:true}));  
  
// Database Connectivity
var Schema = mongoose.Schema;  
var movieSchema = new Schema({      
    movieno: { type: String, unique : true, dropDups: true  },       
    moviename: { type: String   }, 
	movieimdb: { type: String},  
	movielang: { type: String},         
},{ versionKey: false });  
var model = mongoose.model('movie', movieSchema, 'movie');  

app.get('/welcome.html', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.sendFile( __dirname + "/" + "welcome.html" );
})

app.get('/about.html', function (req, res) {  
   console.log("Got a GET request for /about");  
   res.sendFile( __dirname + "/" + "about.html" );
})

//api for INSERT data from database  
app.post("/api/savedata",function(req,res){   
       
    var mod = new model(req.body);  
	req.body.serverMessage = "NodeJS replying to REACT"
	mod.save(function (err, result){                       
        if(err) 
		{ 
			console.log(err.message); 
			//res.send("Duplicate Entry")
			res.json({
			status: 'fail'
		    })
		} 
		else
		{
            console.log('Movie Inserted');
			/*Sending the respone back to the angular Client */
			res.json({
			msg: 'We received your data!!!(nodejs)',
			status: 'success',mydata:req.body
			})
		}
       })     
})  

 // get data from database DISPLAY  
 app.get('/display', function (req, res) { 
//------------- USING EMBEDDED JS -----------
 model.find().sort({movieno:1}).exec(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{movies: i})  
     })
//---------------------// sort({empid:-1}) for descending order -----------//
})

app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

//api for Delete data from database  
app.get("/delete", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var movie=req.query.moviename;
	
        model.remove({"moviename":movie},function(err, obj){
				if (err) {
					console.log("Failed to remove data.");
			} else {
				if (obj.result.n>=1)
				{
				res.send("<br/>"+movie+":"+"<b>Movie Deleted</b>");
				console.log("Movie Deleted")
				}
				else
					res.send("Movie Not Found")
			}
        });
  })
  	

//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var movie=req.query.moviename;
	model.find({moviename: movie},{moviename:1,movieno:1,movielang:1,movieimdb:1,_id:0}).exec(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else
	{
	if (docs=='')
		res.send("<br/>"+movie+":"+"<b>Movie Not Found</b>")
	else
	    res.status(200).json(docs);
	}
  });
  })  
  
// call by default index.html page  
app.get("*",function(req,res){   
    res.sendFile(srcpath +'/index.html');  
})   
//server stat on given port  
app.listen(port,function(){   
    console.log("server start on port:"+ port);  
})  

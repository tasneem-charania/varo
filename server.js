var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var VARO_COLLECTION = "varo";
var USER_COLLECTION = "users";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Create link to React build directory
var distDir = __dirname + "/src/dist/";
app.use(express.static(distDir));

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// VARO API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.post("/api/varo", function(req, res) {
  var newVaro = req.body;

  if (!req.body.date) {
    handleError(res, "Invalid date", "Must provide a date.", 400);
  }
  newVaro.date = req.body.date;

  db.collection(VARO_COLLECTION).insertOne(newVaro, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/api/varo/id/:id"
 *    GET: Get the varo by date and id
 *    PUT: Update varo by date and id
 *    DELETE: Delete varo by date and id
 */

app.get("/api/varo/id/:id", function(req, res) {
  db.collection(VARO_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get varo");
    } else {
      res.status(200).json(doc);
    }
  });
});

/*  "/api/varo/date/:date"
 *    GET: Get the varo by date
 *    PUT: Update varo by date
 *    DELETE: Delete varo by date
 */

app.get("/api/varo/date/:date", function(req, res) {

  db.collection(VARO_COLLECTION).findOne({ "date": req.params.date }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get varo");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/varo/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(VARO_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update varo");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/varo/:id", function(req, res) {
  db.collection(VARO_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete varo");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});

app.get("/api/users",function (req,res) {
  db.collection(USER_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/users", function(req, res) {
  var newUser = req.body;

  if(req.body.username == '' || req.body.password == '') {
    handleError(res, err.message, "Username And Password cannot be empty.");
  }
  var username = req.body.username;
  username = username.replace(/\s+/g, '');
  newUser.username = username;
  newUser.password = new Buffer(req.body.password).toString('base64');

  db.collection(USER_COLLECTION).insertOne(newUser, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new user.");
    } else {
      res.status(201).json(doc.ops[0]._id);
    }
  });
});

app.post("/api/login", function(req, res) {

  var username = req.body.username;
  username = username.replace(/\s+/g, '');

  db.collection(USER_COLLECTION).findOne({ "username": username}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get varo");
    } else {
      var password = new Buffer(req.body.password).toString('base64');
      if(!doc) {
        handleError(res, "No such user", "Failed to login with username and password.", 500);
      }
      else if(doc.password == password) {
        var key = doc._id + '||' + doc.password;
        res.status(200).json(key);
      }
      else {
        handleError(res, err.message, "Failed to login with username and password.", 401);
      }
    }
  });
});

app.post("/api/search", function (req, res) {

  var fullName  = req.body.fullName;


  db.collection(VARO_COLLECTION).find({ "varos.value": fullName}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Error Searching By Name");
    }
    else {
      res.status(200).json(docs);
    }
  });
});
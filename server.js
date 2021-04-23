
//laod all modules
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
//url connection
const url = "mongodb+srv://Admin:admin123@cluster0.fmtcv.mongodb.net/companydatabase?retryWrites=true&w=majority"

//database connection
var dbconnect;
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        console.log(err.message);
    } else {
        dbconnect = database.db("companydatabase")///creates the database is not already created
        console.log("using " + dbconnect.databaseName + " database");

        dbconnect.createCollection("clients", function (err, result) {
            if (err) console.log(err.message);
            console.log(result + " collection created");
        })
    }
      
            dbconnect.createCollection("mainclient", function (err, result) {
                if (err) throw err;
                console.log(result + "Collection created!");

            });
        }
    
})
//let port = process.env.PORT||3000
app.listen(3000)
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
app.get("/", function (req, res) {
    dbconnect.collection("clients").find({}).toArray(function (err, clients) {
        if (err) console.log(err.message);
        console.log(clients);
        res.render("index", { clients })
    })
    
    // search item
    dbconnect.collection("clients").find({ "firstname": "Eic Mashau" }).toArray(function (err, result) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Learners driving BMW's");
            console.log(result);
        }
    })
})
app.get("/form", function (req, res) {
    res.render("form")
})
app.post("/addbenform", function (req, res) {
    let client = req.body;
    client["date"] = new Date();
    dbconnect.collection("clients").insertOne(client, function (err, result) {
        if (err) console.log(err.message);
        console.log("client successfuly inserted to the database");
    })
    dbconnect.collection("clients").find({}).toArray(function (err, clients) {
        if (err) console.log(err.message);
        console.log(clients);
        res.render("index", { clients })
    })


})




app.get("/mainmember", function (req, res) {
    res.render("mainmember")
})
app.post("/addmainmemberform", function (req, res) {
    let mainclient = req.body;
    mainclient["date"] = new Date();
    dbconnect.collection("mainclient").insertOne(mainclient, function (err, result) {
        if (err) console.log(err.message);
        console.log("Main Member successfuly inserted to the database");
        dbconnect.collection("mainclients").find({}).toArray(function (err, mainclients) {
            if (err) console.log(err.message);
            console.log(mainclients);
            res.render("form", { mainclients })
        })
    })
    //dbconnect.collection("mainclient").find({}).toArray(function (err, clients) {
    //    if (err) console.log(err.message);
    //    console.log(clients);
    //    res.render("index", { clients })
    //})


})



app.get(function (req, res) {
    res.render("404")
})

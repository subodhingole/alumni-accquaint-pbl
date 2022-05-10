//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const NewsAPI = require("newsapi");
const { stringify } = require("nodemon/lib/utils");
const newsapi = new NewsAPI("4aa9cbbbe2bf4c40b56eb67556beb7eb");

mongoose.connect("mongodb://localhost:27017/alumniDB");

var Logged = 0;

const alumniSchema = {
  name: String,
  email: String,
  branch: String,
  profession: String,
  language: String,
  phone: String,
  address: String,
  dob: String,
};

const adminSchema = {
  username: String,
  password: String,
};

const newsSchema = {
    title: String,
    information: String
}

const Alumni = mongoose.model("Alumni", alumniSchema);
const Admin = mongoose.model("Admin", adminSchema);
const News = mongoose.model("News",newsSchema);

app.get("/", function (req, res) {
  res.render("login");
});

app.get("/alumnilist", function (req, res) {
  if (Logged === 0) {
    res.redirect("/");
  }
  Alumni.find({}, function (err, alumni) {
    if (!err) {
      res.render("alumnilist", {
        alumniList: alumni,
        dir: __dirname,
      });
    }
  });
});

app.get("/news", function (req, res) {
  newsapi.v2
    .topHeadlines({
      category: "technology",
      language: "en",
      country: "in",
    })
    .then((response) => {
      console.log(response.articles.title);
      res.render("newslist", {
        newsList: response.articles,
        dir: __dirname,
      });
    });
});

app.get("/about", function (req, res) {
  res.render("alumnilist", {
    alumniList: [
      {
        name: "About Us",
        email:
          "The Purpose behind the Alumni Interaction Project was to provide a cleaner, easier, and a safer way to interact with the alumnis. Organizers had to sacrifice their precious time for some alumni to respond One on One.",
      },
    ],
    dir: __dirname,
  });
});
app.get("/alumnilogin", function (req, res) {
  res.render("alumnilogin");
});
app.post("/home/search/:sort", function (req, res) {
  if (Logged === 0) {
    res.redirect("/");
  }
  if (req.params.sort === "name") {
    const thename = req.body.alumniName;
    Alumni.find({ name: thename }, function (err, alumni) {
      if (!err) {
        if (alumni.length === 0) {
          res.render("alumnilist", {
            alumniList: [{ name: "No Alumni Found", email: "No Alumni Found" }],
            dir: __dirname,
          });
        } else {
          res.render("alumnilist", {
            alumniList: alumni,
            dir: __dirname,
          });
        }
      }
    });
  } else if (req.params.sort === "language") {
    Alumni.find({ language: req.body.alumniLanguage }, function (err, alumni) {
      if (!err) {
        if (alumni.length === 0) {
          res.render("alumnilist", {
            alumniList: [{ name: "No Alumni Found", email: "No Alumni Found" }],
            dir: __dirname,
          });
        } else {
          res.render("alumnilist", {
            alumniList: alumni,
            dir: __dirname,
          });
        }
      }
    });
  } else if (req.params.sort === "profession") {
    Alumni.find(
      { profession: req.body.alumniProfession },
      function (err, alumni) {
        if (!err) {
          if (alumni.length === 0) {
            res.render("alumnilist", {
              alumniList: [
                { name: "No Alumni Found", email: "No Alumni Found" },
              ],
              dir: __dirname,
            });
          } else {
            res.render("alumnilist", {
              alumniList: alumni,
              dir: __dirname,
            });
          }
        }
      }
    );
  } else if (req.params.sort === "dob") {
    Alumni.find({ dob: req.body.alumniDOB }, function (err, alumni) {
      if (!err) {
        if (alumni.length === 0) {
          res.render("alumnilist", {
            alumniList: [{ name: "No Alumni Found", email: "No Alumni Found" }],
            dir: __dirname,
          });
        } else {
          res.render("alumnilist", {
            alumniList: alumni,
            dir: __dirname,
          });
        }
      }
    });
  }
});

app.get("/home", function (req, res) {
  if (Logged === 1) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});

app.get("/sorting", function (req, res) {
  if (Logged === 1) {
    res.render("sorting");
  } else {
    res.redirect("/");
  }
});

app.get("/addnews", function (req, res) {
  if (Logged == 1) {
    res.render("addnews");
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function (req, res) {
  Logged = 0;
  res.redirect("/");
});

app.get("/addalumni", function (req, res) {
  res.render("addalumni");
});

app.post("/addnews",function(req,res){
    const titles = req.body.title;
    const informations = req.body.information;

    const newNews = new News({
        title : titles,
        information: informations
    })
    newNews.save();
    res.render("home");
})

app.post("/alumniLogin", function (req, res) {
  res.render("alumniLogin");
});

app.post("/addalumni", function (req, res) {
  const newAlumni = new Alumni({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    dob: req.body.dob,
    language: req.body.language,
    profession: req.body.profession,
    branch: req.body.branch,
  });
  newAlumni.save();
  res.render("home");
});

app.post("/", function (req, res) {
  userName = req.body.username;
  passWord = req.body.psw;
  console.log("triggering home");
  console.log(userName, passWord);
  Admin.find({}, function (err, admin) {
    if (!err) {
      console.log(admin);
      if (admin[0].username == userName && admin[0].password == passWord) {
        Logged = 1;
        res.render("home");
      } else {
        res.redirect("/");
      }
    }
  });
});

app.post("/alumnihome", function (req, res) {
//    if(Logged==1){
//        News.find({},function(err,news){
//            if(!err){
//                if(!news){
//                 console.log("there is no news to be displayed");
//                }else{
//                    console.log("there is something that is going to get displayed here");
//                    console.log(news);
//                }
//            }
//        })
//    }
News.find({},function(err,news){
    if(!err){
        res.render("alumnihome",{
            newsList: news,
            dir: __dirname,

        })

    }
})

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = "3000";
}

app.listen(port, function () {
  console.log("Server has started sucessfully");
});

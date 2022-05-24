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

mongoose.connect("mongodb+srv://fester:@cluster0.urtjh.mongodb.net/alumniDB");

var Logged = 0;

const alumniSchema = {
  name: String,
  email: String,
  yop: String,
  branch: String,
  profession: String,
  language: String,
  phone: String,
  address: String,
  dob: String,
};

const suggestionSchema = {
  suggestionTitle: String,
  suggestionDescription: String
}

const adminSchema = {
  username: String,
  password: String,
};

const alumniLoginSchema = {
  username: String,
  password: String,
};

const newsSchema = {
  title: String,
  information: String,
};

const taskSchema = {
  title: String,
}

const Alumni = mongoose.model("Alumni", alumniSchema);
const Admin = mongoose.model("Admin", adminSchema);
const News = mongoose.model("News", newsSchema);
const AlumniLogin = mongoose.model("AlumniLogin", alumniLoginSchema);
const Task = mongoose.model("Task", taskSchema);
const Suggestion = mongoose.model("Suggestion", suggestionSchema);

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

app.post("/suggestionhandle",function(req,res){
  const newSuggestion = new Suggestion({
    suggestionTitle: req.body.suggestionTitle,
    suggestionDescription: req.body.suggestionDescription
  })
  newSuggestion.save();
  res.redirect("/alumnihome");
})

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

app.get("/alumnihome:request", function (req, res) {
  if (Logged === 0) {
    res.redirect("/");
  } else {
    res.render("request");
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

app.post("/addnews", function (req, res) {
  const titles = req.body.title;
  const informations = req.body.information;

  const newNews = new News({
    title: titles,
    information: informations,
  });
  newNews.save();
  res.render("home");
});

app.post("/alumniLogin", function (req, res) {
  res.render("alumniLogin");
});

app.post("/addalumni", function (req, res) {
  const newAlumni = new Alumni({
    name: req.body.name,
    email: req.body.email,
    yop: req.body.yop,
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

app.get("/suggestions",function(req,res){
  if(Logged === 0){
    res.redirect("/");
  }
  else{
    res.render("suggestions");
  }
})

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

app.get("/alumnihome", function (req, res) {
  
  if (Logged === 0) {
    res.redirect("/");
  } else {
    AlumniLogin.find(
      { username: userName, password: passWord },
      function (err, alumni) {
        if (!err) {
          if (alumni.length === 0) {
            res.redirect("/alumnilogin");
          } else {
            Logged = 2;
            News.find({}, function (err, news) {
              if (!err) {
                news.reverse();
                res.render("alumnihome", {
                  newsList: news,
                  dir: __dirname,
                });
              }
            });
          }
        }
      }
    );
  }
});

app.post("/alumnihome", function (req, res) {
  Logged = 2;
  userName = req.body.username;
  passWord = req.body.psw;
  console.log(userName, passWord);
  AlumniLogin.find(
    { username: userName, password: passWord },
    function (err, alumni) {
      if (!err) {
        if (alumni.length === 0) {
          res.redirect("/alumnilogin");
        } else {
          Logged = 2;
          News.find({}, function (err, news) {
            if (!err) {
              news.reverse();
              res.render("alumnihome", {
                newsList: news,
                dir: __dirname,
              });
            }
          });
        }
      }
    }
  );
});

app.get("/tasks",function(req,res){

  if(Logged === 0){
    res.redirect("/");
  }
  else{
    Task.find({},function(err,task){
      if(!err){
        res.render("tasks",{
          tasksList:task,
          dir:__dirname
        });
      }
    })
  }

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = "3000";
}

app.listen(port, function () {
  console.log("Server has started sucessfully");
});

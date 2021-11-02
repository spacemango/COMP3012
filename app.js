/*
 Authors:
 Your name and student #: Anita Khuu (A00699479)
 (Make sure you also specify on the Google Doc)
*/
const express = require("express");
let app = express();
const fs = require("fs").promises;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("pages/index"));

app.get("/myForm", (req, res) => res.render("pages/myForm"));

app.get("/searchResult", (req, res) => res.render("pages/searchResult"));

app.post("/myForm", (req, res) => {
  let text = req.body.movieText;
  let movies = text.split(",");
  let movieParse = "";

  console.log(movies);

  movies.forEach(element => movieParse += `
      <label class="todo-list__label">
          <input type="checkbox" name="" id="" />
            <i class="check"></i>
            <span>${element}</span>
      </label>
      `);

  res.render("pages/searchResult", {
    result: movieParse
  });

});

app.get("/myListQueryString", (req, res) => {
  let htmlForm = "";
  let movie1 = req.query.movie1;
  let movie2 = req.query.movie2;

  htmlForm += `
  <label class="todo-list__label">
          <input type="checkbox" name="" id="" />
            <i class="check"></i>
            <span>${movie1}</span>
      </label>
      <label class="todo-list__label">
          <input type="checkbox" name="" id="" />
            <i class="check"></i>
            <span>${movie2}</span>
      </label>
  `;

  res.render("pages/index", {
    queryResult: htmlForm
  });
});

/* [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().The promise rejected with the reason "Error movie not found".] {
  code: 'ERR_UNHANDLED_REJECTION'
} */

app.get("/search/:movieName", (req, res) => {
  let movieName = req.params.movieName;
  let getMovie = "";

  return new Promise((resolve, reject) => {
    fs.readFile("movieDescriptions.txt", "utf8")
      .then((data) => {

        let fileArr = data.split("\n");

        console.log(fileArr);

        for (const element of fileArr) {
          if (element.toLowerCase().includes(movieName.toLowerCase())) {
            resolve();
            return element;

          } else {
            reject("Error movie not found");
          }
        }
      })
      .then((movie) => {

        //only http://localhost:3000/search/transformers works

        let movieFound = movie.split(":");

        getMovie += `
        <h1>${movieFound[0]}</h1>
        <p>${movieFound[1]}</p>
        <a href="http://localhost:3000/">Home Page</a>
        `
        res.render("pages/searchResult", {
          result: getMovie
        });

      })
      .catch((err) => {
        if (err.code === "ERR_UNHANDLED_REJECTION") {
          reject("Whatlol");
        } else {
          reject(err);
        }
      });
  })
});

app.listen(3000, () => {
  console.log("Server is running on port 3000 🚀");
});
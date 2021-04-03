const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT;
const app = express();
const mammoth = require("mammoth");
const cheerio = require('cheerio');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let readyQuestions = [];
async function examExtractor(path) {
    let arrayOfQuestion = [];
   // let readyQuestions = [];
    let i = 0;
    let t = mammoth.convertToHtml({path: path})
        .then((result) => {
                let html = result.value;
                let $ = cheerio.load(html);
                console.log($.text())
                $("li", "ol").each(function () {
                    if ($(this).html().includes("?"))
                        arrayOfQuestion.push($(this).html())
                });
                arrayOfQuestion.forEach(element => {
                    let tmp = cheerio.load(element);
                    let obj = {
                        question: tmp.html().split("?")[0].replace("<html><head></head><body>", ""),
                        choices: [],
                        answer: ""
                    }

                    tmp("li").each(function () {
                        obj.choices.push(tmp(this).html())
                    })
                    readyQuestions.push(obj);
                })

                let answerCounter = 0;
                $("p").each(function () {
                    console.log($(this).html())
                    readyQuestions[answerCounter].answer = $(this).html().replace("Answer: ", "");
                    answerCounter++;
                });
                console.log(readyQuestions)

            }
        )
}

//examExtractor("file.docx")

app.get("/", function (req, res) {
    examExtractor("file.docx")
    setTimeout(()=>{

        res.send( readyQuestions[2].question);
    },4000)

});

app.post("/", function (req, res) {
    res.redirect("/");
});


app.listen(port || 3000, function () {
    console.log("system is work on" + 3000);
})



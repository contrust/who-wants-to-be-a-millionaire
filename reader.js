const fs = require('fs');

let readQuestionsPromise = new Promise(function (resolve, reject){
    fs.readFile('static/questions/questions.json',
        (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));})})

readQuestionsPromise.then(function(data) {
console.log(data['questions']);
})



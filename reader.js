const fs = require('fs');
fs.readFile('./sources/questions/questions.json', (err, data) => {
    if (err) throw err;
    return JSON.parse(data);
});

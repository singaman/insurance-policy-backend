const fs = require('fs');
const csv = require('csv-parser');

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => records.push(data))
            .on('end', () => resolve(records))
            .on('error', (error) => reject(error));
    });
}

module.exports = { parseCSV };

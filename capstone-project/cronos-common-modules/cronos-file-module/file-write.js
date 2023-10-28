const fs = require('fs');

async function writeToFile(filePath, data) {
    try {
        await fs.writeFileSync(filePath, JSON.stringify(data), {encoding: 'utf8', flag: 'w'});
        console.log('[Success] File data write sync successfully');
    } catch (err) {
        console.log(`[Failed] File data writing sync failed! Error: ${JSON.stringify(err)}`);
    }
}

module.exports = { writeToFile };
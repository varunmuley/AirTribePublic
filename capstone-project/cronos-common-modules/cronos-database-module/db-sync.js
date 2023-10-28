const { dbContext } = require('./database');

async function syncDB() {
    try {
        const entities = require('./entities');
        await dbContext.authenticate();
        dbContext.sync({alter: true});
    } catch(exp) {
        console.log(`[Failed] Something went wrong in DB sync. Error ${JSON.stringify(exp)}`);
    }
}

syncDB();

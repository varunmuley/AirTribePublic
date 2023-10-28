function init() {
    for(let i=0; i<20; i++)
    {
        try {
            console.log(`This is process execution output line no. ${i}`);
            if (i == 11) {
                throw "Something went wrong."
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

init();
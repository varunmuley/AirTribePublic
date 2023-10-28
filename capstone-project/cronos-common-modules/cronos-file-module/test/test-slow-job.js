function init() {
    for(let i=0; i<20; i++)
    {
        setTimeout(() => {
            console.log(`This is process execution output line no. ${i}`);
        }, i * 1000);
    }
}

init();
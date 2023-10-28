function calculateTimeoutDuration(frequency, interval) {
    // logic goes here.
    let duration = 0;
    switch (frequency) {
        case 's':
            duration = interval * 1000;
            break;
        case 'm':
            duration = interval * 60 * 1000;
            break;
        case 'h':
            duration = interval * 60 * 60 * 1000;
            break;
        case 'd':
            duration = interval * 24 * 60 * 60 * 1000;
            break;
        case 'M':
            duration = interval * 30 * 24 * 60 * 60 * 1000;
            break;
        case 'Y':
            duration = interval * 12 * 30 * 24 * 60 * 60 * 1000;
            break;                
    }
    return duration;
}

function calculateRemaingTimeoutDuration(next_scheduled_at) {
    const remainingMilliSec = new Date(next_scheduled_at) - new Date();
    return remainingMilliSec;
}

function milliSecToMinAndSec(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(2);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

module.exports = {calculateTimeoutDuration, calculateRemaingTimeoutDuration, milliSecToMinAndSec};
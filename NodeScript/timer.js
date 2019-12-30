var USER, CORE, ID, TIME;
var time = 1000 * 10;

function userTimeCheck() {
    console.log('Setting timer');

    TIME = setTimeout(timedOut, time);
}

function timedOut() {
    console.log('Ended');

    clearTimeout(TIME)
    CORE.leave(USER, ID);
}

function clear() {
    clearTimeout(TIME);
}
module.exports.timer = class {
    constructor(user, core, gameid) {
        CORE = core;
        USER = user;
        ID = gameid;
        this.inactivity_checker = userTimeCheck;
    }
    refreshTimer() { clear(); }
}
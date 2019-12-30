module.exports.ServerPlayer = class {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
    }
    getUser() { return this.user; }
    getPass() { return this.pass; }
}
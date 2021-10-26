const connection = require("./connection");

class DB {
    // Keep reference to the connection on the class in case we need it
    constructor(connection) {
        this.connection = connection;
    }
}
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('admin-db');
db.serialize(function() {
    db.run("CREATE TABLE user (name TEXT, email TEXT, password TEXT)");
})
db.close();
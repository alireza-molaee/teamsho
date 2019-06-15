const inquirer = require('inquirer');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

inquirer
  .prompt([
    {
        name: 'name',
        message: 'user full name',
        type: 'input',
        prefix: '1',
        suffix: '?',
    },
    {
        name: 'email',
        message: 'user email',
        type: 'input',
        prefix: '2',
        suffix: '?',
    },
    {
        name: 'password',
        message: 'user password',
        type: 'password',
        prefix: '3',
        suffix: '?',
    }
  ])
  .then(answers => {
    const db = new sqlite3.Database('admin-db');
    bcrypt.hash(answers.password, 10, function(err, hash) {
        db.serialize(function() {
            db.run(`INSERT INTO user VALUES ("${answers.name}", "${answers.email}", "${hash}")`);
            db.close();
        })
    });
  });
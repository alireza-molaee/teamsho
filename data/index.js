require('dotenv').config();
require("@babel/register");
const fs = require('fs');
const path = require('path');
const mi = require('mongoimport');
const MongoClient = require('mongodb').MongoClient;
const chalk = require('chalk');

function dropCollection(collectionName) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DATABASE_URL, function (err, db) {
            if (err) reject(err);
            var dbo = db.db(process.env.DATABASE_NAME);
            dbo.collection(collectionName).drop(function (err, delOK) {
                if (err) {
                    if (err.code === 26) {
                        resolve();
                    } else {
                        reject(err)
                    }
                };
                if (delOK) resolve();
                db.close();
            });
        });
    })
}

fs.readdir(path.join(__dirname, '../src/models'), (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files
        .filter(fileName => (fileName !== 'index.js'))
        .map(fileName => {
            return path.basename(fileName);
        })
        .map(fileName => {
            return require(path.join('../src/models/', fileName)).default;
        })
        .forEach(model => {
            const collectionName = model.collection.collectionName;
            let data;
            try {
                data = require(`./${collectionName}`);
            } catch (err) {
                return;
            }
            if (data) {
                dropCollection(collectionName)
                .then(() => {
                    mi({
                        fields: data,
                        db: process.env.DATABASE_NAME,
                        collection: collectionName,
                        host: `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`,
                        callback: (err, db) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(chalk.green('import') + chalk.blue(collectionName) + chalk.green('collection data'));
                            }
                        }
                    })
                })
            }
        });
});
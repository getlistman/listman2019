"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient;
let db;
const actions = {
    // https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
    connect: (url) => {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
            }
            else {
                return MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
                    let dbName = process.env.IS_OFFLINE ? 'listman' : process.env.STAGE;
                    db = client.db(dbName);
                    resolve(db);
                });
            }
        });
    },
    getConnection: () => {
        return db;
    },
    getNextId: (collectionName) => __awaiter(this, void 0, void 0, function* () {
        const r = yield db.collection('counters').findOneAndUpdate({ _id: collectionName }, { $inc: { seq: 1 } }, { upsert: true, returnOriginal: false });
        return r.value.seq;
    })
};
module.exports = actions;

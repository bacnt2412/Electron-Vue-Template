var Datastore = require('nedb');
var db = null;
var Fs = require('fs');
const Store = require('electron-store');
const store = new Store();
// static async getFolder(nameFolder) {
//     return new Promise((resolve, reject) => {
//         try {
//             db.find({ type: 'folder' }, function (error, docs) {
//                 if (error) return reject(error);
//                 return resolve(docs);
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

export default class DB {
    static async loadDatabase(file) {
        return new Promise((resolve, reject) => {
            try {
                db = new Datastore({
                    filename: file,
                    inMemoryOnly: false
                });
                db.loadDatabase(function (err) {
                    if (err) {
                        return resolve(false);
                    }
                    return resolve(true);
                });
            } catch (error) {
                console.log(error);
                return resolve(false);
            }
        });
    }
    // ============= FOLDER =============

    static async getFolder() {
        return new Promise((resolve, reject) => {
            try {
                db.find({
                        type: 'folder'
                    })
                    .sort({
                        created: 1
                    })
                    .exec(function (error, docs) {
                        if (error) return resolve(false);
                        return resolve(docs);
                    });
            } catch (error) {
                resolve(false);
            }
        });
    }

    static async createFolder(nameFolder) {
        return new Promise((resolve, reject) => {
            try {
                db.insert({
                        name: nameFolder,
                        type: 'folder',
                        created: Date.now(),
                    },
                    function (error, newDoc) {
                        if (error) return reject(false);
                        return resolve(newDoc);
                    }
                );
            } catch (error) {
                return reject(false);
            }
        });
    }

    static async updateFolder(filter, dataUpdate) {
        return new Promise((resolve, reject) => {
            try {
                db.update(filter, {
                    $set: dataUpdate
                }, {}, function (err, numAffected, affectedDocuments, upsert) {
                    if (err) return reject(false);
                    resolve(affectedDocuments);
                });
            } catch (error) {
                reject(false);
            }
        });
    }

    static async removeFolder(filter) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.deleteAccountMulti({
                    idFolder: filter._id
                });
                db.remove(filter, function (error, numRemoved) {
                    if (error) return reject(false);
                    return resolve(numRemoved);
                });
            } catch (error) {
                reject(false);
            }
        });
    }
    // ============= ACCOUNT =============
    static async getAccountDeleted() {
        return new Promise((resolve, reject) => {
            try {
                db.find({
                        type: 'account',
                        isDelete: true
                    })
                    .sort({
                        created: -1
                    })
                    .exec(function (error, docs) {
                        if (error) return reject(false);
                        return resolve(docs);
                    });
            } catch (error) {
                reject(false);
            }
        });
    }

    static async getAccount(idFolder) {
        return new Promise((resolve, reject) => {
            try {
                db.find({
                        type: 'account',
                        idFolder: idFolder,
                        isDelete: false
                    })
                    .sort({
                        created: -1
                    })
                    .exec(function (error, docs) {
                        if (error) return reject(false);
                        return resolve(docs);
                    });
            } catch (error) {
                reject(false);
            }
        });
    }

    static async checkExistAccount(ssn) {
        return new Promise((resolve, reject) => {
            try {
                db.findOne({
                    ssn,
                    isDelete: false
                }, function (error, newDoc) {
                    if (error) return reject(false);
                    return resolve(newDoc);
                });
            } catch (error) {
                return reject(false);
            }
        });
    }

    static async addListAccount(listAccount) {
        for (const account of listAccount) {
            await this.addNewAccount(account);
        }
        // return new Promise((resolve, reject) => {
        //     try {
        //         db.insert(listAccount, function (error, newDoc) {
        //             if (error) return reject(false);
        //             return resolve(newDoc);
        //         });
        //     } catch (error) {
        //         return reject(false);
        //     }
        // });
    }

    static async addNewAccount(account) {
        return new Promise((resolve, reject) => {
            try {
                db.insert(account, function (error, newDoc) {
                    console.log(newDoc);
                    if (error) return reject(false);
                    return resolve(newDoc);
                });
            } catch (error) {
                return reject(false);
            }
        });
    }


    static async deleteAccountMulti(filter) {
        return new Promise((resolve, reject) => {
            try {
                db.update(filter, {
                    $set: {
                        isDelete: true
                    }
                }, {
                    multi: true
                }, function (err, numAffected, affectedDocuments, upsert) {
                    if (err) return reject(false);
                    resolve(affectedDocuments);
                });
            } catch (error) {
                reject(false);
            }
        });
    }

    static async deleteAccount(filter) {
        return new Promise((resolve, reject) => {
            try {
                db.update(filter, {
                    $set: {
                        isDelete: true
                    }
                }, {}, function (err, numAffected, affectedDocuments, upsert) {
                    if (err) return reject(false);
                    resolve(affectedDocuments);
                });
            } catch (error) {
                reject(false);
            }
        });
    }

    static async updateAccount(account) {
        return new Promise((resolve, reject) => {
            try {
                db.update({
                    _id: account._id
                }, {
                    $set: account
                }, {}, function (err, numAffected, affectedDocuments, upsert) {
                    if (err) return reject(false);
                    resolve(affectedDocuments);
                });
            } catch (error) {
                reject(false);
            }
        });
    }
}
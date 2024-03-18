const fs = require('fs');

function getAccount(accountName) {

    const accountJSON = fs.readFileSync(`account/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    });

    return JSON.parse(accountJSON);

}

module.exports = getAccount;
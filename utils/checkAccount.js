const fs = require('fs');

const chalk = require('chalk');

const getAccount = require('./getAccount');

function checkAccount(accountName, password) {

    if (!fs.existsSync(`account/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome!'));
        return false;
    }

    accountName = getAccount(accountName);

    if (password != accountName.password) {
        console.log(chalk.bgRed.black('Ops! senha incorreta, tente novamente mais tarde.'));
        return false;
    }

    return true;

}

module.exports = checkAccount;
const fs = require('fs');

const chalk = require('chalk');

function checkAccount(accountName, password){

    console.log(accountName, password);

    if(!fs.existsSync(`account/${accountName}.json`)){
        console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome!'));
        return false;
    }

    fs.readFile(`account/${accountName}.json`, 'utf-8', function(err, data){

        console.log(data);

    });

    return true;

}

module.exports = checkAccount;
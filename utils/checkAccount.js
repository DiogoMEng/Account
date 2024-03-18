function checkAccount(accountName){

    if(!fs.existsSync(`account/${accountName}.json`)){
        console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome!'));
        return false;
    }

    return true;

}
const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

console.log("Account Iniciado");

operation()

// operações possíveis do sistema
function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }])
        .then((answer) => {

            const action = answer['action'];

            if(action === "Criar Conta"){

                createAccount();

            } else if (action === 'Depositar') {

                deposit();

            } else if (action === 'Consultar Saldo') {



            } else if (action === 'Sacar') {



            } else if (action === 'Sair') {

                console.log(chalk.bgBlue.black('Obrigado por usar o Account'));
                process.exit();

            }

        })
        .catch(err => console.log(err));

}


// criação de conta
function createAccount(){

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

    buildAccount();

}


// criação de conta
function buildAccount(){

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta: '
    }]).then(answer => {

        const accountName = answer['accountName'];
        console.info(accountName);

        if(!fs.existsSync('account')){

            fs.mkdirSync('account')

        }

        if(fs.existsSync(`account/${accountName}.json`)){

            console.log(chalk.bgRed.black('Esta conta já está em uso, escolha outro nome'));

            buildAccount()

        }

        fs.writeFileSync(`account/${accountName}.json`, '{ "balance": 0 }', function(err){

            console.log(err);

        })

        console.log(chalk.green('Parabéns, a sua conta foi criada com sucesso'));
        operation();

    }).catch(err => console.log(err));

}


// insere valor na conta do usuário
function deposit(){

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName'];

        // verifica existencia da conta
        if(!checkAccount(accountName)){

            return deposit();

        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto você deseja depositar?'
        }]).then((answer) => {

            const amount = answer['amount'];
            addAmount(accountName, amount);
            operation();

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

}


function checkAccount(accountName){

    if(!fs.existsSync(`account/${accountName}.json`)){

        console.log(chalk.bgRed.black('Está conta não existe, escolha outro nome!'));

        return false;

    }

    return true;

}


function addAmount(accountName, amount){

    const accountData = getAccount(accountName);

    if(!amount){
        console.log(chalk.bgRed.black ('Ocorreu um erro, tente novamente mais tarde'));
        return deposit();
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(`account/${accountName}.json`, JSON.stringify(accountData), function(err){

        console.log(err);

    });

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`));

}


function getAccount(accountName) {

    const accountJSON = fs.readFileSync(`account/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    });

    return JSON.parse(accountJSON);

}
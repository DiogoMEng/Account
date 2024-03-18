const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

const checkAccount = require('./utils/checkAccount');
const getAccount = require('./utils/getAccount');

console.log("Account Iniciado");

operation()


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

            switch (action) {
                case 'Criar Conta':
                    createAccount();
                    break;
                case 'Depositar':
                    deposit();
                    break;
                case 'Consultar Saldo':
                    getAccountBalance();
                    break;
                case 'Sacar':
                    withdraw();
                    break;
                case 'Sair':
                    console.log(chalk.bgBlue.black('Obrigado por usar o Account'));
                    process.exit();
            }

        })
        .catch(err => console.log(err));

}


function createAccount(){ // #

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

    buildAccount();

}


function buildAccount(){

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta: ',
    }, {
        name: 'userName',
        message: 'Digite o seu nome completo: '
    }, {
        name: 'password',
        message: 'Define uma senha para sua conta: '
    }]).then(answer => {

        const accountName = answer['accountName'];
        const userName = answer['userName'];
        const password = answer['password'];
        console.info(accountName);

        if(!fs.existsSync('account')){
            fs.mkdirSync('account')
        }

        if(fs.existsSync(`account/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já está em uso, escolha outro nome'));
            return buildAccount();
        }

        fs.writeFileSync(`account/${accountName}.json`, `{ "userName": "${userName}", "password": "${password}", "balance": 0 }`, function(err){
            console.log(err);
        })

        console.log(chalk.green('Parabéns, a sua conta foi criada com sucesso'));
        operation();

    }).catch(err => console.log(err));

}


function deposit(){ // #

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        },
        {
            name: 'password',
            message: 'Informe sua senha de usuário: '
        }
    ]).then((answer) => {

        const accountName = answer['accountName'];
        const password = answer['password'];


        // verifica existencia da conta
        if(!checkAccount(accountName, password)){
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


function getAccountBalance() { // #

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
        .then(answer => {

            const accountName = answer['accountName'];
            
            if(!checkAccount(accountName)){
                return getAccountBalance();
            }
            
            const accountData = getAccount(accountName);

            console.log(chalk.bgBlue.black(`Saldo disponível: R$ ${accountData.balance}`));

            operation();

        }).catch(err => console.log(err));

}


function withdraw() { // #

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then(answer => {

        const accountName = answer['accountName'];

        if(!checkAccount(accountName)){
            return withdraw();
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            }
        ]).then(answer => {

            const amount = answer['amount'];

            removeAmount(accountName, amount);

        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

}


function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName);

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'));
        return withdraw();
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível'));
        return withdraw();
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

    fs.writeFileSync(`account/${accountName}.json`, JSON.stringify(accountData), function(err) {
        console.log(err);
    });

    console.log(chalk.green(`Foi realizado o saque de R$${amount} na sua conta`));

    operation();

}
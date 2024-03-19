const inquirer = require('inquirer');
const chalk = require('chalk');

const fs = require('fs');

const MoneyMovement = require('./services/MoneyMovement')
const checkAccount = require('./utils/checkAccount');
const getAccount = require('./utils/getAccount');

class BankOperations extends MoneyMovement {
    operation() {

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
                        this.createAccount();
                        break;
                    case 'Depositar':
                        this.deposit();
                        break;
                    case 'Consultar Saldo':
                        this.getAccountBalance();
                        break;
                    case 'Sacar':
                        this.withdraw();
                        break;
                    case 'Sair':
                        console.log(chalk.bgBlue.black('Obrigado por usar o Account'));
                        process.exit();
                }

            })
            .catch(err => console.log(err));

    }

    // ### CREATE ACCOUNT ### 
    createAccount() { // #

        console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'));
        console.log(chalk.green('Defina as opções da sua conta a seguir'));

        this.buildAccount();

    }


    buildAccount() {

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

            if (!fs.existsSync('account')) {
                fs.mkdirSync('account')
            }

            if (fs.existsSync(`account/${accountName}.json`)) {
                console.log(chalk.bgRed.black('Esta conta já está em uso, escolha outro nome'));
                return this.buildAccount();
            }

            fs.writeFileSync(`account/${accountName}.json`, `{ "userName": "${userName}", "password": "${password}", "balance": 0 }`, function (err) {
                console.log(err);
            })

            console.log(chalk.green('Parabéns, a sua conta foi criada com sucesso'));
            this.operation();

        }).catch(err => console.log(err));

    }

    // ### CHECK ACCOUNT BALANCE ###
    getAccountBalance() { // #

        inquirer.prompt([
            {
                name: 'accountName',
                message: 'Informe o nome de sua conta: '
            },
            {
                name: 'password',
                message: 'Informe seu senha de usuário: '
            }
        ])
            .then(answer => {

                const accountName = answer['accountName'];
                const password = answer['password'];

                if (!checkAccount(accountName, password)) {
                    return getAccountBalance();
                }

                const accountData = getAccount(accountName);

                console.log(chalk.bgBlue.black(`Saldo disponível: R$ ${accountData.balance}`));

                this.operation();

            }).catch(err => console.log(err));

    }

}

module.exports = BankOperations;
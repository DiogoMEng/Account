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

            }

        })
        .catch(err => console.log(err));

}


// criação de conta
function createAccount(){

    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco'));
    console.log(chalk.green('Defina as opções da sua conta a seguir'));

}
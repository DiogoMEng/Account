class MoneyMovement {
    // ### DEPOSIT AMOUNT INTO THE ACCOUNT   ###
    deposit() { // #

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

            if (!checkAccount(accountName, password)) {
                return deposit();
            }

            inquirer.prompt([{
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            }]).then((answer) => {

                const amount = answer['amount'];

                this.addAmount(accountName, amount);

                this.operation();

            }).catch(err => console.log(err));

        }).catch(err => console.log(err));

    }


    addAmount(accountName, amount) {

        const accountData = getAccount(accountName);

        if (!amount) {
            console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'));
            return deposit();
        }

        accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

        fs.writeFileSync(`account/${accountName}.json`, JSON.stringify(accountData), function (err) {
            console.log(err);
        });

        console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`));

    }

    // ### WITHDRAW ACCOUNT BALANCE ###
    withdraw() { // #

        inquirer.prompt([
            {
                name: 'accountName',
                message: 'Qual o nome da sua conta?'
            },
            {
                name: 'password',
                message: 'Informe seu senha de usuário: '
            }
        ]).then(answer => {

            const accountName = answer['accountName'];
            const password = answer['password'];

            if (!checkAccount(accountName, password)) {
                return withdraw();
            }

            inquirer.prompt([
                {
                    name: 'amount',
                    message: 'Quanto você deseja sacar?'
                }
            ]).then(answer => {

                const amount = answer['amount'];

                this.removeAmount(accountName, amount);

            }).catch(err => console.log(err));

        }).catch(err => console.log(err));

    }


    removeAmount(accountName, amount) {

        const accountData = getAccount(accountName);

        if (!amount) {
            console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'));
            return withdraw();
        }

        if (accountData.balance < amount) {
            console.log(chalk.bgRed.black('Valor indisponível'));
            return withdraw();
        }

        accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

        fs.writeFileSync(`account/${accountName}.json`, JSON.stringify(accountData), function (err) {
            console.log(err);
        });

        console.log(chalk.green(`Foi realizado o saque de R$${amount} na sua conta`));

        this.operation();

    }

}

module.exports = MoneyMovement;
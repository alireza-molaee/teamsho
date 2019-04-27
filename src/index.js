import app from './app';
import models, { connectDb } from './models';
import chalk from 'chalk';

const port = process.env.PORT || 8080;

connectDb().then(() => {
    console.log(chalk.green('connect to mongo database successfully.'))
    app.listen(port, () =>
        console.log(`${chalk.blue('Teamsho')} ${chalk.green('app listening on port')} ${chalk.greenBright(port)}`),
    );
});
import chalk from 'chalk'
import fs from 'fs/promises';
import readline from 'readline/promises';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


class Questions {
    public static async askQuestion(query: string) {
        let valid = false;
        let answer = undefined;
        do {
            answer = await rl.question(query);
            if (answer.length > 0) {
                valid = true;
            }
    
            if (!valid) console.log(chalk.bgRed(chalk.black('Invalid input!')));
        } while (!valid || !answer);
    
        rl.pause();
        return answer;
    }

    public static async getPathFromUserInput(query: string) {
        let validPath = false;
        let answer = undefined;
        do {
            answer = await Questions.askQuestion(query)
            if (answer.length > 0) {
                validPath = await fs.exists(answer);
                if (!validPath) console.log(chalk.bgRed(chalk.black('Invalid path!')));
            }
        } while (!validPath || !answer);

        rl.pause();
        return answer;
    }
}

export default Questions;
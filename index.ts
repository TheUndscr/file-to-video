import path from 'node:path/win32';
import chalk from 'chalk';
import ffmpeg from 'fluent-ffmpeg';
import Questions from './modules/Questions';

async function main() {
    const inputPath = await Questions.getPathFromUserInput('Enter file to be processed: ');
    const outputPath = await Questions.getPathFromUserInput('Enter output path: ');

    const outputFileName = path.basename(inputPath, path.extname(inputPath));
    const outputFilePath = outputPath + '/' + outputFileName + '-filetovid.mp4';
    
    console.clear();
    console.log(`Outputting video to ${chalk.yellow(outputPath + '/' + outputFileName + '-filetovid.mp4')}...`);

    let totalTime = 0;
    ffmpeg()
        .input(inputPath)
        .inputOptions([
            '-f u8',
            '-ar 44100',
            '-ac 2',
        ])
        .filterGraph([
            'avectorscope=s=640x640:mode=lissajous_xy:draw=dot:scale=lin:zoom=1,format=yuv420p',
        ])
        .outputOptions([
            '-c:v libx264',
            '-sws_flags fast_bilinear'
        ])
        .saveToFile(outputFilePath)
        .on('end', () => {
            console.clear()
            console.log(chalk.green('File converted successfully!'));
        })
        .on('codecData', (data) => {
            totalTime = parseInt(data.duration.replace(/:/g, ''));
        })
        .on('error', (err) => { 
            console.error('Error converting file: ', err);
        })
        .on('progress', (progress) => {
            const time = parseInt(progress.timemark.replace(/:/g, ''));
            const percent = (time / totalTime) * 100;

            process.stdout.write(`Processing: ${chalk.blue(percent.toFixed(2))}%\r`);
        });
}

main();
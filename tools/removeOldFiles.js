const fs = require('fs');
const path = require('path');

main();

function main() {
  console.log('Cache date: ', __filename);
  const pathToFiles = path.join(process.cwd(), 'build', 'public');
  const readDirResult = fs.readdirSync(pathToFiles);
  const currentDateInMs = +new Date();

  // 90 days
  const diff = 1000 * 60 * 60 * 24 * 90;
  const result = [];
  const freshFiles = [];

  readDirResult.forEach((file) => {
    const pathToFile = path.join(pathToFiles, file);
    const statResult = fs.statSync(pathToFile);

    if (currentDateInMs - statResult.atimeMs > diff) {
      fs.unlinkSync(pathToFile);
      result.push(file);
    } else {
      freshFiles.push(pathToFile);
    }
  });

  console.log('------------------------------');
  console.log('Old files removing result: ');
  if (!result.length) {
    console.log('No old files!');
  } else {
    result.forEach((r) => {
      console.log(r);
    });
  }
  console.log('------------------------------');
  console.log('------------------------------');
  console.log('Fresh files: ');
  freshFiles.forEach((r) => {
    console.log(r);
  });
  console.log('------------------------------');
}

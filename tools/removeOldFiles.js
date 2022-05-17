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
  const mutableResult = [];
  const mutableFreshFiles = [];

  readDirResult.forEach((file) => {
    const pathToFile = path.join(pathToFiles, file);
    const statResult = fs.statSync(pathToFile);

    if (currentDateInMs - statResult.atimeMs > diff) {
      fs.unlinkSync(pathToFile);
      mutableResult.push(file);
    } else {
      mutableFreshFiles.push(pathToFile);
    }
  });

  console.log('------------------------------');
  console.log('Old files removing result: ');
  if (!mutableResult.length) {
    console.log('No old files!');
  } else {
    mutableResult.forEach((r) => {
      console.log(r);
    });
  }
  console.log('------------------------------');
  console.log('------------------------------');
  console.log('Fresh files: ');
  mutableFreshFiles.forEach((r) => {
    console.log(r);
  });
  console.log('------------------------------');
}

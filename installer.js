var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './dist/win-unpacked/',
    outputDirectory: './dist/installer',
    authors: 'Beefo',
    exe: 'AutoChat.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
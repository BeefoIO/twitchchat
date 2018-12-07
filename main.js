const electron = require('electron')
const url = require('url')
const path = require('path')
const net = require('net')
var fs = require('fs');
require('./service');

if (!fs.existsSync('./settings.json')) {
  if (!fs.existsSync('./settings_example.json')) {
    logger.fatal('You need to create a settings.json.');
    logger.fatal('Normaly there is a settings_example.json but in your case there isn\'t. You may redownload from the git repository');
    logger.fatal('Or you download it from my website');
    process.exit(0)
  }
  var settings_example = fs.readFileSync('./settings_example.json', 'utf8');
  fs.writeFileSync('./settings.json', settings_example);
  logger.fatal('We have copied the content of settings_example.json to settings.json')
  logger.fatal('It will now stop and you can edit the settings.json to your preferences')
  logger.fatal('Read the _comments section of the settings.json for further informations to the structure')
  process.exit(0);
}
var settings = fs.readFileSync('./settings.json', 'utf8');
var settings = JSON.parse(settings);

const { app, BrowserWindow, Menu, ipcMain, shell, dialog, autoUpdater } = electron;

let mainWindow

process.env.NODE_ENV = 'development'

if (require('electron-squirrel-startup')) process.exit(0)
// squirrel

if (handleSquirrelEvent()) app.quit()

function handleSquirrelEvent () {
  if (process.argv.length === 1) {
    return false
  }

  const ChildProcess = require('child_process')

  const appFolder = path.resolve(process.execPath, '..')
  const rootAtomFolder = path.resolve(appFolder, '..')
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
  const exeName = path.basename(process.execPath)

  const spawn = (command, args) => {
    let spawnedProcess

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {
        detached: true
      })
    } catch (err) {}
    return spawnedProcess
  }

  const spawnUpdate = (args) => {
    return spawn(updateDotExe, args)
  }

  const squirrelEvent = process.argv[1]
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName])
      setTimeout(app.quit, 1000)
      return true
    case '--squirrel-obsolete':
      app.quit()
      return true
  }
}

app.on('ready', function () {
  if(settings.openSettingsDirectory)
    shell.showItemInFolder("settings.json");

  //appPathWindow = showAppPath(path.resolve(process.execPath, '..'));

  //mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  mainWindow = createMainWindow()

  mainWindow.setMenu(null)
  //mainWindow.setMenu(mainMenu);
  
  mainWindow.show()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.setUserTasks([
  {
    program: process.execPath,
    arguments: '--open-website',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'Website',
    description: 'Developer\'s Website'
  }, {
    program: process.execPath,
    arguments: '--open-teamspeak',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'Teamspeak',
    description: 'Support Teamspeak'
  }
])

autoUpdater.addListener('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateURL) => {
  /*win.webContents.send('update-downloaded', {
    releaseNotes: releaseNotes,
    releaseName: releaseName,
    releaseDate: releaseDate,
    updateURL: updateURL
  })*/
  autoUpdater.quitAndInstall();
})

autoUpdater.addListener('checking-for-update', () => {
  //win.webContents.send('checking-for-update')
})

autoUpdater.addListener('update-not-available', () => {
  //win.webContents.send('update-not-available')
})

autoUpdater.addListener('update-available', () => {
  //win.webContents.send('update-available')
})

function changeWindow (file) {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gui/', file, '.html'),
    protocol: 'file:',
    slashes: true
  }))
}

autoUpdater.addListener('error', (err) => { // eslint-disable-line
})

autoUpdater.setFeedURL('http://deploy.beefo.io/autochat/win64')
autoUpdater.checkForUpdates()

switch (process.argv[1]) {
  case '--open-website':
    shell.openExternal('https://beefo.io')
    app.quit()
    break
  case '--open-teamspeak':
    shell.openExternal('ts3server://thunderbolt')
    app.quit()
    break
}

/* ipcMain.on('settings:design:update', function(e, mainColorCode, secondColorCode, mainFontCode, titleFontCode){
  let json = '';
  json = JSON.stringify({ mainColor: mainColorCode, secondColor: secondColorCode, mainFont: mainFontCode, titleFont: titleFontCode });
  storage.set('json/settings.json', json, (err) => {
    if (err) {
      console.error(err)
    }
  });

});
ipcMain.on('settings:send', function(e){
  mainWindow.webContents.send('settings:get', mainColor, secondColor, mainFont, titleFont);
}); */

function createMainWindow () {
  let mainWindow
  mainWindow = new BrowserWindow({ frame: true, show: false, icon: 'resources/icon/appicon.ico' })
  mainWindow.loadURL(url.format({
    pathname: /* path.join(__dirname, 'gui/lo.html') */ 'localhost:6077/auth.html',
    protocol: 'http:',
    slashes: true
  }))

  mainWindow.setMaxListeners(99999)
  mainWindow.setResizable(false)

  return mainWindow
}

function showMessage (message) {
  let mainWindow
  mainWindow = new BrowserWindow({ frame: true, show: true, icon: 'resources/icon/appicon.ico' })
  mainWindow.loadURL(url.format({
    pathname: /* path.join(__dirname, 'gui/lo.html') */ 'localhost:6078/message/' + Buffer.from(message).toString('base64'),
    protocol: 'http:',
    slashes: true
  }))

  mainWindow.setMaxListeners(99999)
  mainWindow.setResizable(false)

  return mainWindow
}

function showAppPath (appPath) {
  let mainWindow
  mainWindow = new BrowserWindow({ frame: true, show: true, icon: 'resources/icon/appicon.ico' })
  mainWindow.loadURL(url.format({
    pathname: /* path.join(__dirname, 'gui/lo.html') */ 'localhost:6078/appPath/' + Buffer.from(appPath).toString('base64'),
    protocol: 'http:',
    slashes: true
  }))

  mainWindow.setMaxListeners(99999)
  mainWindow.setResizable(false)

  return mainWindow
}

const mainMenuTemplate = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Home',
        click(){
          changeWindow('index');
        }
      },
      {
        label: 'Servers',
        click(){
          changeWindow('servers');
        }
      },
      {
        label: 'Teams',
        click(){
          changeWindow('teams');
        }
      },
      {
        label: 'Chat',
        click(){
          changeWindow('chat');
        }
      },
      {
        label: 'Contact',
        click(){
          changeWindow('contact');
        }
      },
    ]
  }
];

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developing',
    submenu: [
      {
        label: 'Toggle Inspector',
        accelerator: process.platform == "darwin" ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

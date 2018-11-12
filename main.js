const electron = require('electron')
const url = require('url')
const path = require('path')
const net = require('net')
require('./service');

const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = electron;

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

  appPathWindow = showAppPath(path.resolve(process.execPath, '..'));

  mainWindow = createMainWindow()

  mainWindow.setMenu(null)
  // Menu.setMenu(mainMenu);

  // change window directly while updater not working
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
    description: 'Developer Website'
  }, {
    program: process.execPath,
    arguments: '--open-teamspeak',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'Teamspeak',
    description: 'Support Teamspeak'
  }
])

function changeWindow (file) {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gui/', file, '.html'),
    protocol: 'file:',
    slashes: true
  }))
}

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

/* const mainMenuTemplate = [
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
} */

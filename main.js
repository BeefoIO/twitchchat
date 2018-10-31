const electron = require('electron');
const url = require('url');
const path = require('path');
const net = require('net');
require('./service');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

process.env.NODE_ENV = 'development';

app.on('ready', function(){
  mainWindow = createMainWindow();

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Menu.setApplicationMenu(mainMenu);

  //change window directly while updater not working
  mainWindow.show();
});

app.on('window-all-closed', () => {
  app.quit()
});

function changeWindow(file){
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gui/', file, '.html'),
    protocol: 'file:',
    slashes: true
  }))
}

ipcMain.on('settings:design:update', function(e, mainColorCode, secondColorCode, mainFontCode, titleFontCode){
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
});

function createMainWindow() {
  let mainWindow;
  mainWindow = new BrowserWindow({frame: true, show: false});
  mainWindow.loadURL(url.format({
    pathname: /*path.join(__dirname, 'gui/lo.html')*/ 'localhost:6077/auth.html',
    protocol: 'http:',
    slashes: true
  }));

  mainWindow.setMaxListeners(99999);
  mainWindow.setResizable(false);
  
  return mainWindow;
}

function sendWindowStatus(status) {
  updateWindow.webContents.send('status-update', status);
}
function sendDownloadStatus(downloadProgress) {
  updateWindow.webContents.send('download-status', downloadProgress);
}
function sendUpdateError(error) {
  updateWindow.webContents.send('update-error', error);
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
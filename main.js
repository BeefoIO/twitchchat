const electron = require('electron');
const url = require('url');
const path = require('path');
const net = require('net');

const {app, BrowserWindow, Menu, ipcMain, protocol} = electron;

process.env.NODE_ENV = 'development';

app.on('ready', function(){
  mainWindow = createMainWindow();

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', () => {
  app.quit()
});

function createMainWindow() {
  let mainWindow;
  mainWindow = new BrowserWindow({frame: true});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'gui/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.setMaxListeners(99999);
  mainWindow.setResizable(false);
  
  return mainWindow;
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
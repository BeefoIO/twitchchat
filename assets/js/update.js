const {ipcRenderer} = require('electron');

ipcRenderer.on('status-update', function (event, status){
    titleObj = document.getElementById("title");
    imgObj = document.getElementById('loading-gif');
    titleObj.innerHTML = 'BoostFuze Updater';
    document.title = 'BoostFuze :: Update';
    if(status !== 'Error! View Console for more information.') {
        imgObj.src = 'img/loading.gif';
    }
    const statusTextObj = document.getElementById('status');
    statusTextObj.innerHTML = status;
});
ipcRenderer.on('download-status', function (event, downloadProgress){
    console.warn('downloadProgress: ' + downloadProgress);
    const downloadObj = document.getElementById('download-bar');
    downloadObj.style.width = downloadProgress + '%';
});
ipcRenderer.on('update-error', function (event, error){
    titleObj = document.getElementById("title");
    imgObj = document.getElementById('loading-gif');
    titleObj.innerHTML = 'BoostFuze Updater: Error';
    document.title = 'BoostFuze :: Update | Error';
    imgObj.src = 'img/error.png';
    console.error('updateError: ' + error);
});

ipcRenderer.send('test-update');
//ipcRenderer.send('test-update-error');
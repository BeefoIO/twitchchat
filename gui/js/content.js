ipcRenderer.on('content:get', function(e, file){
    $.get(file, function(data) {
        ipcRenderer.send('content:give', data);
    });
});
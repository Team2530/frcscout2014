var app = {
    initialize: function() {
        this.bindEvents();
        $('#path').html(window.appRootDir.fullPath + "/scoutdata.txt");
    },
    
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        //Blue = cordova.require("bluetoothSerial");
    }
};

function start() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024, gotFS, error);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("scoutdata.txt", {create: true}, gotFileEntry, error);
}

function gotFileEntry(fileEntry) {
    fileEntry.file(reader, error);
}

function reader(file) {
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        data = evt.target.result;
        connectStart();
    }
    reader.readAsText(file);
}

function connectStart() {
    Blue.connect($('#mac-address').val(), connectSuccess, error);
}


function connectSuccess() {
    Blue.write(data, writeSuccess, error);
}

function writeSuccess() {
    Blue.read(readSuccess, error);
}

function readSuccess(data) {
    if (data == 'false') {
        alert("Data sent successfully");
    } else {
        error("receiving error"); 
    }
}

function error(err) {
   alert("Error reading data..." + err.code);
}

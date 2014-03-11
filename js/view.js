var app = {
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        loadFile();
    }
};

function loadFile() {
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
        data = evt.target.result.split("\n");
        readSuccess();
    }
    reader.readAsText(file);
}

function error(err) {
    alert("Error reading data..." + err.code);
}

function readSuccess() {
    var count = 0;
    for (var loc in data) {
        var cdata = data[loc];
        if (cdata != '') {
            count += 1;
            cdata = $.parseJSON(cdata);
            $('#robots').append('<tr><td>' + cdata[1]["generic-robot"] + '</td><td class="delete" onclick="deleteRobot(\'' + cdata[0] + '\');">-</td></tr>');
        }
    }
    $('#count').html(count);
}

function deleteRobot(id) {
    if (confirm("Do you really want to delete this robot?")) {
        for (var loc in data) {
            cdata = $.parseJSON(data[loc]);
            if (cdata[0] == id) {
                data[loc] = "";
                break;
            }
        }
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024, gotFSDelete, error);
    }
}

function gotFSDelete(fileSystem) {
    fileSystem.root.getFile("scoutdata.txt", {create: true, exclusive: false}, gotRemoveFileEntry, error);
}

function gotRemoveFileEntry(fileEntry) {
    fileEntry.remove(deleteSuccess, error);
}

function deleteSuccess() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024, gotFSRewrite, error);
}

function gotFSRewrite(fileSystem) {
    fileSystem.root.getFile("scoutdata.txt", {create: true}, gotRewriteFileEntry, error);
}

function gotRewriteFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileRewriter, error);
}

function gotFileRewriter(writer) {
    var string = "";
    for (var loc in data) {
        string += data[loc] + "\n";
    }
    
    writer.write(string);
    
    rewriteSuccess();
}

function rewriteSuccess() {
    alert("Succcess deleting robot.");
    location.href = "view.html";
}

function deleteAll() {
    if (confirm("Are you sure you want to delete all robots?")) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024, gotFSDeleteAll, error);
    }
}

function gotFSDeleteAll(fileSystem) {
    fileSystem.root.getFile("scoutdata.txt", {create: true, exclusive: false}, gotRemoveFileEntryAll, error);
}

function gotRemoveFileEntryAll(fileEntry) {
    fileEntry.remove(deleteAllSuccess, error);
}

function deleteAllSuccess() {
    alert("Success deleting all robots.");
    location.href = "index.html";
}


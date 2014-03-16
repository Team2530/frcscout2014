function save() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024, gotFS, error);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("scoutdata.txt", {create: true, exclusive: false}, gotFileEntry, error);
}

function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, error);
}

function gotFileWriter(writer) {
    var rid = Date.now();
    var data = {};
    var ids = ["generic-robot", "generic-ally1", "generic-enemy1", "generic-ally2", "generic-enemy2", "generic-enemy3", "auton-drives", "auton-high", "auton-hot", "auton-count", "auton-codes", "auton-comments", "match-trusstoss", "match-trussdefend", "match-goaldefend", "match-stuck", "match-assists", "match-cycles", "match-highmade", "match-highmiss", "match-lowmade", "match-lowmiss", "match-catchmade", "match-catchmiss", "match-comments"];
    for (var id in ids) {
        data[ids[id]] = $("#" + ids[id]).val();
    }
    
    writer.seek(writer.length);
    writer.write(JSON.stringify([rid, data]) + "\n");
    
    success();
}

function error(err) {
    alert("Error saving data..." + err.code);
} 

function success() {
    alert("Data saved.");
    location.href = "index.html";
}

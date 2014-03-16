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
            $('#robots').append('<tr><td onclick="viewRobot(\'' + cdata[0] + '\');">' + cdata[1]["generic-robot"] + '</td><td class="delete" onclick="deleteRobot(\'' + cdata[0] + '\');">-</td></tr>');
        }
    }
    $('#count').html(count);
}

function viewRobot(id) {
    /* 
    [1394997338738,{"generic-robot":"1234","generic-ally1":"","generic-enemy1":"","generic-ally2":"","generic-enemy2":"","generic-enemy3":"","auton-count":"","auton-comments":"","match-assists":"","match-highmade":"","match-highmiss":"","match-lowmade":"","match-lowmiss":"","match-catchmade":"","match-catchmiss":"","match-comments":""}]
    */
    alert(id);
    alert(data);
    for (var loc in data) {
        alert(loc);
        if (data[loc] != '') {
            var cdata = $.parseJSON(data[loc]);
            if (cdata[0] == id) {
                $('#content').html(
                    '<button class="small" onclick="location.href=\'view.html\'">Back</button>' + 
                    "<h2>Robot: " + cdata[1]["generic-robot"] + "</h2>" +
                    "<p>With " + cdata[1]["generic-ally1"] + " and " + cdata[1]["generic-ally2"] + " against " + cdata[1]["generic-enemy1"] + ", " + cdata[1]["generic-enemy2"] + ", and " + cdata[1]["generic-enemy3"] + ".<br></p>" + 
                    "<h2>Autonomous mode:</h2>" + 
                    "<p>Drives: " + cdata[1]["auton-drives"] + "<br>Shoots at High Goal: " + cdata[1]["auton-high"] + "<br>Shoots at Hot Goal: " + cdata[1]["auton-hot"] + "<br>Hot Goals made: " + cdata[1]["auton-count"] + "<br>Multiple Codes: " + cdata[1]["auton-codes"] + "<br>Comments: " + cdata[1]["auton-comments"] + "<br><br></p>" + 
                    "<h2>Match:</h2>" + 
                    "<p>Tosses over Truss: " + cdata[1]["match-trusstoss"] + "<br>Defends Truss: " + cdata[1]["match-trussdefend"] + "<br>Defends Goal: " + cdata[1]["match-goaldefend"] + "<br>Ball Stuck: " + cdata[1]["match-stuck"] + "<br>Assists/Match: " + cdata[1]["match-assists"] + "<br>Cycles/Match: " + cdata[1]["match-cycles"] + "<br>High Goals (made / miss): " + cdata[1]["match-highmade"] + ' / ' + cdata[1]["match-highmiss"] + "<br>Low Goals (made / miss): " + cdata[1]["match-lowmade"] + ' / ' + cdata[1]["match-lowmiss"] + "<br>Catches (made / miss): " + cdata[1]["match-catchmade"] + ' / ' + cdata[1]["match-catchmiss"] + "<br>Comments: " + cdata[1]["match-comments"] + "<br><br></p>"
                );
                break;
            }
        }
    }
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


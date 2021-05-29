const { ipcRenderer } = require('electron')

function onload() {
    ipcRenderer.send("getLauncherOpts");
    document.querySelector('.ram-min').onchange = function() {
        document.querySelector('.ram-min-label').innerHTML = "Ram minimum (" + this.value + "G)";
    }
    
    document.querySelector('.ram-max').onchange = function() {
        document.querySelector('.ram-max-label').innerHTML = "Ram maximum (" + this.value + "G)";
    }
}

ipcRenderer.on("getLauncherOpts", (event, user, password) => {
    document.querySelector('.email-input').value = user;
    document.querySelector('.password-input').value = password;
})

function play() {
    document.querySelector('.error').style.opacity = "0";
    let email = document.querySelector('.email-input').value;
    let password = document.querySelector('.password-input').value;

    if(email === "" || password === "") {
        document.querySelector('.error').innerHTML = "Please fill credentials";
        document.querySelector('.error').style.opacity = "1";
        return;
    }

    document.querySelector('.play').disabled = true;
    document.querySelector('.play').innerHTML = "Play <i class='fas fa-circle-notch fa-spin'></i>";
    ipcRenderer.send("play", email, password, document.querySelector('.check-file').checked, document.querySelector('.check-save').checked, document.querySelector('.ram-min').value, document.querySelector('.ram-max').value);
}

ipcRenderer.on("log", (event, log) => {
    console.log(log);
})

ipcRenderer.on("check", (event, current, total) => {
    let p = (current/total*100);
    if(p > 100) {
        p = 100;
    }
    document.querySelector('.progress-bar').style.width = p + "%";
    document.querySelector('.progress-bar').innerHTML = "<b>Checking files " + parseInt(p) + "% (" + current + "/" + total + ")</b>";
})

ipcRenderer.on("download", (event, current, total) => {
    let p = (current/total*100);
    if(p > 100) {
        p = 100;
    }
    document.querySelector('.progress-bar').style.width = p + "%";
    document.querySelector('.progress-bar').innerHTML = "<b>Downloading " + parseInt(p) + "% (" + bytesToSize(total-current) + ")</b>";
})

ipcRenderer.on("launch", (event) => {
    document.querySelector('.progress-bar').style.backgroundColor = "#33944b";
    document.querySelector('.progress-bar').innerHTML = "<b>Starting game</b>";
})

ipcRenderer.on("error", (event) => {
    document.querySelector('.progress-bar').style.backgroundColor = "#b93c48";
    document.querySelector('.progress-bar').innerHTML = "<b>Error</b>";
})

ipcRenderer.on("error-login", (event) => {
    document.querySelector('.error').innerHTML = "Wrong credentials";
    document.querySelector('.error').style.opacity = "1";
    document.querySelector('.play').disabled = false;
    document.querySelector('.play').innerHTML = "Play";
})

ipcRenderer.on("close", (event) => {
    document.querySelector('.error').innerHTML = "The game was closed";
    document.querySelector('.error').style.opacity = "1";
    document.querySelector('.play').disabled = false;
    document.querySelector('.play').innerHTML = "Play";
    document.querySelector('.progress-bar').style.width = 0;
})

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'Ko', 'Mo', 'Go', 'To'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }
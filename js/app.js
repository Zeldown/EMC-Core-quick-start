const { ipcRenderer } = require('electron')

function play() {
    document.querySelector('.error').style.opacity = "0";
    let email = document.querySelector('.email-input').value;
    let password = document.querySelector('.password-input').value;

    if(email === "" || password === "") {
        document.querySelector('.error').innerHTML = "Please fill in your login details";
        document.querySelector('.error').style.opacity = "1";
        return;
    }

    document.querySelector('.play').disabled = true;
    document.querySelector('.play').innerHTML = "Play <i class='fas fa-circle-notch fa-spin'></i>";
    ipcRenderer.send("play", email, password);
}

ipcRenderer.on("log", (event, log) => {
    console.log(log);
})

ipcRenderer.on("check", (event) => {
    document.querySelector('.progress-bar').style.width = "100%";
    document.querySelector('.progress-bar').innerHTML = "<b>Checking files</b>";
})

ipcRenderer.on("download", (event, current, total) => {
    let p = (current/total*100);
    if(p > 100) {
        p = 100;
    }
    document.querySelector('.progress-bar').style.width = p + "%";
    document.querySelector('.progress-bar').innerHTML = "<b>Downloading " + parseInt(p) + "%</b>";
})

ipcRenderer.on("launch", (event) => {
    document.querySelector('.progress-bar').style.backgroundColor = "#33944b";
    document.querySelector('.progress-bar').innerHTML = "<b>Starting Minecraft</b>";
})

ipcRenderer.on("error", (event) => {
    document.querySelector('.progress-bar').style.backgroundColor = "#b93c48";
    document.querySelector('.progress-bar').innerHTML = "<b>Error</b>";
})

ipcRenderer.on("error-login", (event) => {
    document.querySelector('.error').innerHTML = "Your credentials are incorrect";
    document.querySelector('.error').style.opacity = "1";
    document.querySelector('.play').disabled = false;
    document.querySelector('.play').innerHTML = "Play";
})
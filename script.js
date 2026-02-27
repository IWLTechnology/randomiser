var autoPickTimeout;

var localData = localStorage.getItem("dataStorage");
if (localData == null) {
    resetStorage();
} else {
    try {
        localData = JSON.parse(localData);
    } catch {
        resetStorage();
    }
}

function init() {
    document.getElementById("mode").value = localData.mode;
    document.getElementById("autoPick").value = localData.autoPick;
    if (localData.transition != "true") {
        document.getElementById("transitions").checked = false;
    }
    if (localData.changeBg != "true") {
        document.getElementById("changebg").checked = false;
    }
    button(3);
}

function updateStorage() {
    localStorage.setItem("dataStorage", JSON.stringify(localData));
}

function button(pressed) {
    var res = document.getElementById("result");
    var body = document.getElementsByTagName("body")[0];
    switch (pressed) {
        case 0:
            document.getElementById("canChangeBg").style.display = "none";
            var randRes = randomNumber(data[localData.mode].names.length);
            var rand = data[localData.mode].names[randRes];
            res.innerHTML = rand;
            if (localData.changeBg == "true") {
                if (data[localData.mode].images[randRes] != null) {
                    var x = data[localData.mode].images[randRes];
                    body.style.backgroundImage = 'url("' + x + '")';
                } else if (data[localData.mode].colours[randRes] != null) {
                    body.style.backgroundColor = data[localData.mode].colours[randRes];
                } else {
                    body.style.backgroundImage = "";
                    body.style.backgroundColor = "white";
                }
            } else {
                body.style.backgroundImage = "";
                body.style.backgroundColor = "white";
            }
            break;
        case 1:
            document.getElementById("set").style.display = "block";
            setTimeout(function () {
                document.getElementById("set").style.opacity = "1";
            }, 1);
            break;
        case 2:
            document.getElementById("set").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("set").style.display = "none";
            }, 500);
            break;
        case 3:
            localData.mode = document.getElementById("mode").value;
            localData.autoPick = document.getElementById("autoPick").value;
            if (Number(localData.autoPick) > 0) {
            } else {
                localData.autoPick = "0";
            }
            body.style.backgroundColor = "";
            body.style.backgroundImage = "";
            res.innerHTML = "The result of your random pick will appear here.";
            if (document.getElementById("changebg").checked) {
                localData.changeBg = "true";
            } else {
                localData.changeBg = "false";
            }
            if (document.getElementById("transitions").checked) {
                localData.transition = "true";
                document.querySelectorAll("*").forEach((element) => {
                    element.style.transition = "all 0.5s linear";
                });
            } else {
                localData.transition = "false";
                document.querySelectorAll("*").forEach((element) => {
                    element.style.transition = "none";
                });
            }
            updateStorage();
            document.getElementById("canChangeBg").style.display = "block";
            document.getElementById("set").style.opacity = "0";
            setTimeout(function () {
                document.getElementById("set").style.display = "none";
            }, 500);
            window.clearInterval(autoPickTimeout);
            if (Number(localData.autoPick) > 0) {
                autoPickTimeout = setInterval(
                    function () {
                        button(0);
                    },
                    Number(localData.autoPick) * 1000
                );
            }
            break;
    }
}

function resetStorage() {
    localData = {
        mode: "colour",
        changeBg: "true",
        transition: "true",
        autoPick: "0"
    };
    updateStorage();
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function randomNumber(max) {
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    var max_value = 0xffffffff;
    var limit = max_value - (max_value % max);
    if (array[0] >= limit) {
        return getSecureRandomInt(0, max);
    }
    return array[0] % max;
}

const $ = (s) => {
    const el = document.getElementById(s);
    if (!el) {
        return null;
    }
    el.on = function (e, c) {
        this.addEventListener(e, c);
        return this;
    };
    return el;
};
const _ = (s) => {
    const els = Array.from(document.querySelectorAll(s));
    if (els.length === 0) {
        return [];
    }
    els.on = function (e, c) {
        this.forEach((el) => el.addEventListener(e, c));
        return this;
    };
    return els;
};

var autoPickTimeout;

var localData = localStorage.getItem("randomiser-storage");
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
    $("mode").value = localData.mode;
    $("autoPick").value = localData.autoPick;
    if (localData.transition != "true") {
        $("transitions").checked = false;
    }
    if (localData.changeBg != "true") {
        $("changebg").checked = false;
    }
    if (localData.tts != "true") {
        $("tts").checked = false;
    }
    button(3);
}

function updateStorage() {
    localStorage.setItem("randomiser-storage", JSON.stringify(localData));
}

function button(pressed) {
    var res = $("result");
    const _b = document.body;
    switch (pressed) {
        case 0:
            $("info").classList.add("hide");
            var randRes = randomNumber(data[localData.mode].names.length);
            var rand = data[localData.mode].names[randRes];
            res.innerHTML = rand;
            if (localData.changeBg == "true") {
                if (data[localData.mode].images[randRes] != null) {
                    var x = data[localData.mode].images[randRes];
                    _b.style.backgroundImage = 'url("' + x + '")';
                } else if (data[localData.mode].colours[randRes] != null) {
                    _b.style.backgroundColor = data[localData.mode].colours[randRes];
                } else {
                    _b.style.backgroundImage = "";
                    _b.style.backgroundColor = "white";
                }
            } else {
                _b.style.backgroundImage = "";
                _b.style.backgroundColor = "white";
            }
            if (localData.tts == "true") {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(rand));
            }
            break;
        case 1:
            $("set").classList.remove("hide");
            setTimeout(function () {
                $("set").classList.remove("o-hide");
            }, 1);
            break;
        case 2:
            $("set").classList.add("o-hide");
            setTimeout(function () {
                $("set").classList.add("hide");
            }, 500);
            break;
        case 3:
            localData.mode = $("mode").value;
            localData.autoPick = $("autoPick").value;
            if (Number(localData.autoPick) > 0) {
            } else {
                localData.autoPick = "0";
            }
/*            _b.style.backgroundColor = "";
            _b.style.backgroundImage = "";
            res.innerHTML = "The result of your random pick will appear here.";*/
            if ($("changebg").checked) {
                localData.changeBg = "true";
            } else {
                localData.changeBg = "false";
            }
            if ($("tts").checked) {
                localData.tts = "true";
            } else {
                localData.tts = "false";
            }
            if ($("transitions").checked) {
                localData.transition = "true";
                _("*").forEach((element) => {
                    element.style.transition = "all 0.5s linear";
                });
            } else {
                localData.transition = "false";
                _("*").forEach((element) => {
                    element.style.transition = "none";
                });
            }
            updateStorage();
            //$("info").classList.remove("hide");
            $("set").classList.add("o-hide");
            setTimeout(function () {
                $("set").classList.add("hide");
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
        autoPick: "0",
        tts: "false"
    };
    updateStorage();
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

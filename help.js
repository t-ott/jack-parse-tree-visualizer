"use strict";

const helpButton = document.getElementById("help-button");
const helpModal = document.getElementById("help-modal");
const closeHelp = document.getElementById("close-help");
const errorModal = document.getElementById("error-modal");
const closeError = document.getElementById("close-error")

helpButton.addEventListener("click", function() {
    helpModal.style.display = "block";
});

closeHelp.onclick = function() {
    helpModal.style.display = "none";
}

closeError.onclick = function() {
    errorModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == helpModal) {
        helpModal.style.display = "none";
    }
    if (event.target == errorModal) {
        errorModal.style.display = "none";
    }
}

window.addEventListener("error", function (e) {
    if (e.error.name == "PythonError") {
        errorModal.style.display = "block";
    }
});
document.addEventListener("DOMContentLoaded", () => {
    startCamera();
    startTimer();
    fetchCandidates();
});

// Countdown Timer
let countdownTimer = 30;
const timerElement = document.getElementById("timer");

function startTimer() {
    const timerInterval = setInterval(() => {
        if (countdownTimer > 0) {
            countdownTimer--;
            timerElement.textContent = `Time left: ${countdownTimer} seconds`;
        } else {
            clearInterval(timerInterval);
            alert("Time's up! Redirecting to login...");
            window.location.href = '/';
        }
    }, 1000);
}

// Camera Access & Face Detection
async function startCamera() {
    const video = document.getElementById("video");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        video.srcObject = stream;
        console.log("Camera started successfully.");

        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        console.log("Face-api.js model loaded.");

        detectFace(video);
    } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("Error accessing camera. Please ensure that camera permissions are granted.");
    }
}

// Face Detection with face-api.js
async function detectFace(videoElement) {
    const canvas = faceapi.createCanvasFromMedia(videoElement);
    document.body.append(canvas);

    const displaySize = { width: videoElement.width, height: videoElement.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);

        if (detections.length > 1) {
            alert("Multiple faces detected! Logging out.");
            window.location.href = '/';
        }
    }, 100);
}

// Voting Functionality
window.App = {
    async vote() {
        const candidateID = document.querySelector("input[name='candidate']:checked")?.value;
        if (!candidateID) {
            document.getElementById("msg").innerHTML = "<p>Please vote for a candidate.</p>";
            return;
        }

        try {
            const instance = await VotingContract.deployed();
            await instance.vote(parseInt(candidateID));
            document.getElementById("voteButton").disabled = true;
            document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";

            clearInterval(timerInterval);
            alert("You voted! Redirecting to login...");
            window.location.href = '/';
        } catch (err) {
            console.error("ERROR! " + err.message);
        }
    }
};

// Fetch & Display Candidates
async function fetchCandidates() {
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length === 0) {
            console.error("No account selected. Please connect your wallet.");
            return;
        }

        const web3 = new Web3(window.ethereum);
        const votingContract = new web3.eth.Contract(VotingArtifacts.abi, VotingArtifacts.networks["5777"].address);

        const countCandidates = await votingContract.methods.getCountCandidates().call();
        const boxCandidate = document.getElementById("boxCandidate");

        for (let i = 0; i < countCandidates; i++) {
            const data = await votingContract.methods.getCandidate(i + 1).call();
            const id = data[0];
            const name = data[1];
            const party = data[2];
            const voteCount = data[3];

            const candidateRow = `
                <tr>
                    <td><input type="radio" name="candidate" value="${id}" id="${id}"> ${name}</td>
                    <td>${party}</td>
                    <td>${voteCount}</td>
                </tr>`;
            boxCandidate.innerHTML += candidateRow;
        }
    } catch (err) {
        console.error("ERROR! " + err.message);
    }
}

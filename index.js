document.addEventListener('DOMContentLoaded', () => {

    const searchButton = document.querySelector('#search-btn');
    const usernameInput = document.querySelector('#user-input');
    const StatsContainer = document.querySelector('.stats-card');
    const easyProgressCircle = document.querySelector('.easy-progress');
    const mediumProgressCircle = document.querySelector('.medium-progress');
    const hardProgressCircle = document.querySelector('.hard-progress');
    const easyLabel = document.querySelector('#easy-label');
    const mediumLabel = document.querySelector('#medium-label');
    const hardLabel = document.querySelector('#hard-label');

    //return true or false
    function validateUsername(username) {
        if(username.trim() === "") {
            alert('Username should not be empty');
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert('Invalid username');
        }
        return isMatching;
    }

    // fetching data
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            searchButton.textContent = "Searching"
            searchButton.disabled = true;

            const response = await fetch(url);
            if(!response.ok) {
                throw new Error('Unable to fetch the user details');
            }
            const parsedData = await response.json();
            displayUserData(parsedData);

        } catch (error) {
            StatsContainer.innerHTML = `<p>${error}</p`;
        } finally {
            searchButton.textContent = "Search"
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total * 100);
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalQues = parsedData.totalQuestions;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;

        const solvedTotalQues = parsedData.totalSolved;
        const solvedTotalEasy = parsedData.easySolved;
        const solvedTotalMedium = parsedData.mediumSolved;
        const solvedTotalHard = parsedData.hardSolved;

        updateProgress(solvedTotalEasy, totalEasyQues, easyLabel, easyProgressCircle);

        updateProgress(solvedTotalMedium, totalMediumQues, mediumLabel, mediumProgressCircle);

        updateProgress(solvedTotalHard, totalHardQues, hardLabel, hardProgressCircle);
        
        StatsContainer.innerHTML = `
            <div class="card">
                <span>Acceptance Rate </span>
                <span id="accpRate-value">${parsedData.acceptanceRate}%</span>
            </div>
        `;

    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    usernameInput.addEventListener('keydown', (event) => {
        // Check if the Enter key (keyCode 13) is pressed
        if (event.key === 'Enter') {
            const username = usernameInput.value;
            if (validateUsername(username)) {
                fetchUserDetails(username);
            }
        }
    });
});


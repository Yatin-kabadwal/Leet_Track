document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stat-card");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regx = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regx.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function updateProgress(circleElement, labelElement, solved, total, difficulty) {
        const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
        circleElement.style.setProperty("--progress-degree", `${percentage}%`);
        labelElement.textContent = `${difficulty}: ${solved}/${total}`;
    }

    function updateStatsCard(data) {
        cardStatsContainer.innerHTML = `
            <h2>Total Solved: ${data.totalSolved}</h2>
            <p>Easy: ${data.easySolved}/${data.totalEasy}</p>
            <p>Medium: ${data.mediumSolved}/${data.totalMedium}</p>
            <p>Hard: ${data.hardSolved}/${data.totalHard}</p>
            <p>Ranking: ${data.ranking ?? "N/A"}</p>
            <p>Contribution Points: ${data.contributionPoints ?? 0}</p>
        `;
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const data = await response.json();
            if (data.status === "error" || !data.totalSolved) {
                throw new Error("No data found");
            }

            // Update the progress bars
            updateProgress(easyProgressCircle, easyLabel, data.easySolved, data.totalEasy, "Easy");
            updateProgress(mediumProgressCircle, mediumLabel, data.mediumSolved, data.totalMedium, "Medium");
            updateProgress(hardProgressCircle, hardLabel, data.hardSolved, data.totalHard, "Hard");

            // Update stats card
            updateStatsCard(data);

        } catch (error) {
            cardStatsContainer.innerHTML = '<p>Data not found (⊙x⊙;)</p>';
            easyLabel.textContent = "Easy";
            mediumLabel.textContent = "Medium";
            hardLabel.textContent = "Hard";
            easyProgressCircle.style.setProperty("--progress-degree", `0%`);
            mediumProgressCircle.style.setProperty("--progress-degree", `0%`);
            hardProgressCircle.style.setProperty("--progress-degree", `0%`);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});

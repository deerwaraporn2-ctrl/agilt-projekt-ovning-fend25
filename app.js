let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

function ageMatches(playerAge, range){
    if(!range || range === ""){
        return true;
    }

    const age = parseInt(playerAge);
    
    if(range === "under-13") return age < 13;
    if(range === "55+") return age >= 55;

    const [min,max] = range.split("-").map(Number);
    return age >= min && age <= max;
}



function save() {

    localStorage.setItem("teamA", JSON.stringify(teamA))
    localStorage.setItem("teamB", JSON.stringify(teamB))

    localStorage.setItem("teamAName", teamAName)
    localStorage.setItem("teamBName", teamBName)

}


function renameTeam(team) {

    if (team === "A") {
        const val = document.getElementById("teamAInput").value
        if (val) teamAName = val
    }
    if (team === "B") {
        const val = document.getElementById("teamBInput").value
        if (val) teamBName = val
    }
    save()
    renderHome()
}


function renderHome() {

    const searchTerm = document.getElementById("searchInput").value;
    const ageRange = document.getElementById("ageFilter").value;
    const rankValue = document.getElementById("rankFilter").value;

    document.getElementById("teamAName").textContent = teamAName
    document.getElementById("teamBName").textContent = teamBName
    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    teamA.forEach(p => {

        const matchesSearch = p.username.toLowerCase().includes(searchTerm);
        const matchesAge = ageMatches(p.age, ageRange);
        const matchesRank = (rankValue === "" || p.ranking === rankValue)

        if(matchesSearch && matchesAge && matchesRank){
            const li = document.createElement("li")
            li.className = "player"
            li.innerHTML = `

            <span onclick="goToPlayer('${p.username}')">${p.username}</span>

            <button onclick="removePlayer('A','${p.username}')">
            Remove
            </button>
            <button onclick="movePlayer('A','${p.username}')">
            Switch team
            </button>

            `
            listA.appendChild(li)
        }
    })
    teamB.forEach(p => {
        const matchesSearch = p.username.toLowerCase().includes(searchTerm);
        const matchesAge = ageMatches(p.age, ageRange);
        const matchesRank = (rankValue === "" || p.ranking === rankValue)

        if(matchesSearch && matchesAge && matchesRank){
            const li = document.createElement("li")
            li.className = "player"
            li.innerHTML = `
            <span onclick="goToPlayer('${p.username}')">${p.username}</span>
            <button onclick="removePlayer('B','${p.username}')">
            Remove
            </button>
            <button onclick="movePlayer('B','${p.username}')">
            Switch team
            </button>

            `
            listB.appendChild(li)
        }
    })
updateTeamStats()
}

function rankToNumber(rank) {
    const map = {
        Iron: 1,
        Bronze: 2,
        Silver: 3,
        Gold: 4,
        Diamond: 5
    }
    return map[rank] || 0
}
function numberToRank(num) {
    const ranks = ["Iron", "Bronze", "Silver", "Gold", "Diamond"]
    return ranks[Math.round(num) - 1] || "-"
}

function updateTeamStats() {

    function calcStats(team) {
        const count = team.length

        const avgAge = count === 0
            ? 0
            : Math.floor(team.reduce((sum, p) => sum + Number(p.age || 0), 0) / count)

        const avgRank = count === 0
            ? 0
            : Math.floor(team.reduce((sum, p) => sum + rankToNumber(p.ranking), 0) / count)

        return { count, avgAge, avgRank }
    }

    const statsA = calcStats(teamA)
    const statsB = calcStats(teamB)

    document.getElementById("teamAStats").textContent =
        `Players: ${statsA.count} | Avg Age: ${statsA.avgAge} | Avg Rank: ${numberToRank(statsA.avgRank)}`

    document.getElementById("teamBStats").textContent =
        `Players: ${statsB.count} | Avg Age: ${statsB.avgAge} | Avg Rank: ${numberToRank(statsB.avgRank)}`
}


async function loadCountries() {
    const countrySelect = document.getElementById("country");
    if(!countrySelect) return;

    const response = await fetch("https://restcountries.com/v3.1/region/europe?fields=name");
    const countries = await response.json();


    countrySelect.innerHTML = `<option value="">Select country</option>`;

    countries
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .forEach(country => {
            countrySelect.innerHTML += `<option value="${country.name.common}">${country.name.common}</option>`;
        });

}

document.addEventListener("DOMContentLoaded", function () {

    loadCountries();

    const searchInput = document.getElementById("searchInput")
    const searchBtn = document.getElementById("searchBtn")

    const filterBtn = document.getElementById("filterBtn");
    const ageFilter = document.getElementById("ageFilter");
    const rankFilter = document.getElementById("rankFilter");

    filterBtn.addEventListener("click", renderHome);

    function searchPlayers() {

        const text = searchInput.value.toLowerCase()
        const players = document.querySelectorAll(".player")

        players.forEach(player => {

            const name = player.textContent.toLowerCase()

            if (name.includes(text)) {
                player.style.display = ""
            } else {
                player.style.display = "none"
            }
            
        })
    }

    searchBtn.addEventListener("click", searchPlayers)

    searchInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchPlayers()
        }
    })

})

function goToPlayer(username) {
    localStorage.setItem("selectedPlayer", username)
    window.location.href = "playerinfo.html"
}

function removePlayer(team, username) {
    if (team === "A") {
        teamA = teamA.filter(p => p.username !== username)
    }
    if (team === "B") {
        teamB = teamB.filter(p => p.username !== username)
    }
    save()
    renderHome()
}

function movePlayer(fromTeam, username) {
    let player;

    if(fromTeam === "A") {
        player = teamA.find(p => p.username === username);

        if(!player) return;
        if(teamB.length >= 5) {
            alert(`${teamBName} is full!`);
            return;
        }
        teamA = teamA.filter(p => p.username !== username);
        teamB.push(player);
    }
    if(fromTeam === "B") {
        player = teamB.find(p => p.username === username);

        if(!player) return;
        if(teamA.length >= 5) {
            alert(`${teamBName} is full!`)
            return;
        }
        teamB = teamB.filter(p => p.username !== username);
        teamA.push(player);
    }
    save();
    renderHome();
}

function usernameExists(username, ignoreUsername = 0) {
    if(ignoreUsername !== "" && username === ignoreUsername){
        return false;
    }

    const existsInA = teamA.some(p => p.username === username);
    const existsInB = teamB.some(p => p.username === username);

    return existsInA || existsInB;
}


function renderAddPlayer() {

    const teamSelect = document.getElementById("teamSelect")

    teamSelect.innerHTML = `
    <option value="A" ${teamA.length >= 5 ? "disabled" : ""}>
    ${teamAName}
    </option>

    <option value="B" ${teamB.length >= 5 ? "disabled" : ""}>
    ${teamBName}
    </option>
    `

    document.getElementById("playerForm").addEventListener("submit", e => {

        e.preventDefault()
        const username = document.getElementById("username").value

        if (usernameExists(username)) {
            document.getElementById("error").textContent = "Username already exists";
            return;
        }
        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: document.getElementById("country").value,
            ranking: document.getElementById("ranking").value

        }
        const team = document.getElementById("teamSelect").value

        if (team === "A") {
            teamA.push(player)
        }
        if (team === "B") {
            teamB.push(player)
        }

        save()
        window.location.href = "index.html"

    })

}

function renderPlayerInfo() {

    const username = localStorage.getItem("selectedPlayer")

    const player = teamA.find(p => p.username === username) || teamB.find(p => p.username === username)

    const profile = document.getElementById("profile")

    profile.innerHTML = `
<div class="profile">
<h2>${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.country}</p>
<p><b>Ranking:</b> ${player?.ranking}</p>
<br>
<button onclick="window.location='index.html'">
Back
</button>

</div>

`

}

function toggleEdit(show){
    const container = document.getElementById("editFormContainer");
    container.style.display = show ? "block" : "none";
    if(show){
        const username = localStorage.getItem("selectedPlayer");
        const player = teamA.find(p => p.username === username) || teamB.find(p => p.username === username)

        document.getElementById("editUsername").value = player.username;
        document.getElementById("editFirstname").value = player.firstname;
        document.getElementById("editLastname").value = player.lastname;
        document.getElementById("editAge").value = player.age;
        document.getElementById("editCountry").value = player.country;
        document.getElementById("editRanking").value = player.ranking;
    }
}

function saveEdit(){
    const oldUsername = localStorage.getItem("selectedPlayer");
    const newUsername = document.getElementById("editUsername").value

    if(usernameExists(newUsername, oldUsername)){
        alert("This username is already taken by another player!")
    }

    const player = teamA.find(p => p.username === oldUsername) || teamB.find(p => p.username === oldUsername);
    

    if(player){

        player.username = newUsername;
        player.firstname = document.getElementById("editFirstname").value;
        player.lastname = document.getElementById("editLastname").value;
        player.age = document.getElementById("editAge").value;
        player.country = document.getElementById("editCountry").value;
        player.ranking = document.getElementById("editRanking").value;

        localStorage.setItem("selectedPlayer", newUsername);

        save();
        renderPlayerInfo();
        updateTeamStats();
        toggleEdit(false);
    }
}
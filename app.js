let teamA = JSON.parse(localStorage.getItem("teamA")) || []
let teamB = JSON.parse(localStorage.getItem("teamB")) || []

let teamAName = localStorage.getItem("teamAName") || "Team A"
let teamBName = localStorage.getItem("teamBName") || "Team B"

const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")

const captainIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z"/></svg>`

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

function setCaptain(teamSide,username){
    let selectedArray = (teamSide === 'A') ? teamA : teamB;

    selectedArray.forEach(p=>{p.isCaptain = false})

    const player = selectedArray.find(p=> p.username === username);
    if(player){
        player.isCaptain = true
        save();
        renderHome();
    }
}

function rankToNumber(rank) {

    if(rank !=="" && !isNaN(rank))return parseInt(rank);

    const map = {
        Iron: 0,
        Bronze: 20,
        Silver: 40,
        Gold: 60,
        Diamond: 80
    }
    return map[rank] || 0
}
function numberToRank(num) {
    if(num >=80) return "Diamond";
    if(num >=60) return "Gold";
    if(num >=40) return "Silver";
    if(num >=20) return "Bronze";
    return "Iron";
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

    const teamACountEl = document.getElementById("teamACount")
    const teamBCountEl = document.getElementById("teamBCount")

    teamACountEl.innerHTML = `Players: ${teamA.length} <span class="team-info">(Max 7 players)</span>`

    if (teamA.length < 3) {
    teamACountEl.innerHTML += `<br><span class="team-warning">Min 3 players required!</span>`
    }

    teamBCountEl.innerHTML = `Players: ${teamB.length} <span class="team-info">(Max 7 players)</span>`

    if (teamB.length < 3) {
    teamBCountEl.innerHTML += `<br><span class="team-warning">Min 3 players required!</span>`
    }


    const listA = document.getElementById("teamAList")
    const listB = document.getElementById("teamBList")
    listA.innerHTML = ""
    listB.innerHTML = ""
    
    teamA.forEach(p => {

        const matchesSearch = p.username.toLowerCase().includes(searchTerm);
        const matchesAge = ageMatches(p.age, ageRange);
        const matchesRank = (rankValue === "" || numberToRank(p.ranking) === rankValue)

        if(matchesSearch && matchesAge && matchesRank){
            const li = document.createElement("li")
            li.className = "player"
            li.innerHTML = `

            <span onclick="goToPlayer('${p.username}')">${p.flag || ""} ${p.username} ${p.isCaptain ?  captainIcon : ""}</span>
            <button onclick="setCaptain('A', '${p.username}')">Make Captain</button>
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
        const matchesRank = (rankValue === "" || numberToRank(p.ranking) === rankValue)

        if(matchesSearch && matchesAge && matchesRank){
            const li = document.createElement("li")
            li.className = "player"
            li.innerHTML = `
            <span onclick="goToPlayer('${p.username}')">${p.flag || ""} ${p.username} ${p.isCaptain ?  captainIcon : ""}</span>
            <button onclick="setCaptain('B', '${p.username}')">Make Captain</button>
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



function updateTeamStats() {

    const teamAStats = document.getElementById("teamAStats");
    const teamBStats = document.getElementById("teamBStats");

    if(!teamAStats || !teamBStats) return;
    

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

    teamAStats.textContent =
        `Players: ${statsA.count} | Avg Age: ${statsA.avgAge} | Avg Rank: ${numberToRank(statsA.avgRank)}`

    teamBStats.textContent =
        `Players: ${statsB.count} | Avg Age: ${statsB.avgAge} | Avg Rank: ${numberToRank(statsB.avgRank)}`
}

function getFlagEmoji(code) {
    return code
        .toUpperCase()
        .replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt(0))
        );
}

async function loadCountries() {
    const countrySelect = document.getElementById("country");
    if (!countrySelect) return;

    const response = await fetch(
        "https://restcountries.com/v3.1/region/europe?fields=name,flags,cca2"
    );
    const countries = await response.json();

    countrySelect.innerHTML = `<option value="">Country</option>`;

    countries
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .forEach(country => {
            const option = document.createElement("option");
            option.value = country.name.common;
            option.textContent = `${getFlagEmoji(country.cca2)} ${country.name.common}`;
            option.dataset.flag = country.flags.png;
            countrySelect.appendChild(option);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    loadCountries();
    const countrySelect = document.getElementById("country");
    const flagImg = document.getElementById("flagPreview");

    if (countrySelect && flagImg) {
        countrySelect.addEventListener("change", function () {
            const selectedOption = countrySelect.options[countrySelect.selectedIndex];

            if (selectedOption && selectedOption.dataset.flag) {
                flagImg.src = selectedOption.dataset.flag;
                flagImg.style.display = "block";
            } else {
                flagImg.src = "";
                flagImg.style.display = "none";
            }
        });
    }

    const searchInput = document.getElementById("searchInput")
    const searchBtn = document.getElementById("searchBtn")

    const filterBtn = document.getElementById("filterBtn");
    const ageFilter = document.getElementById("ageFilter");
    const rankFilter = document.getElementById("rankFilter");

    if(filterBtn){
        filterBtn.addEventListener("click", renderHome);
    }

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
    if(searchBtn && searchInput){
        searchBtn.addEventListener("click", searchPlayers)
        searchInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchPlayers()
        }
    })
}
    

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
        if(teamB.length >= 7) {
            alert(`${teamBName} is full!`);
            return;
        }
        teamA = teamA.filter(p => p.username !== username);
        teamB.push(player);
    }
    if(fromTeam === "B") {
        player = teamB.find(p => p.username === username);

        if(!player) return;
        if(teamA.length >= 7) {
            alert(`${teamAName} is full!`)
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
    <option value="A" ${teamA.length >= 7 ? "disabled" : ""}>
    ${teamAName}
    </option>

    <option value="B" ${teamB.length >= 7 ? "disabled" : ""}>
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
        
        const countrySelect = document.getElementById("country");
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];

        const team = document.getElementById("teamSelect").value;

        let captainStatus = false;

        if(team === "A" && teamA.length === 0){
            captainStatus = true;
        }else if(team === "B" && teamB.length === 0){
            captainStatus = true;
        }

        const player = {
            username,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            country: countrySelect.value,
            flag: selectedOption.textContent.split(" ")[0],
            ranking: document.getElementById("ranking").value,
            isCaptain: captainStatus
        }

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
<h2>${player?.flag || ""} ${player?.username}</h2>
<p><b>Name:</b> ${player?.firstname} ${player?.lastname}</p>
<p><b>Age:</b> ${player?.age}</p>
<p><b>Country:</b> ${player?.flag || ""} ${player?.country}</p>
<p><b>Ranking:</b> ${numberToRank(player?.ranking)} | Level: ${player?.ranking}</p>
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
        document.getElementById("editRanking").value = rankToNumber(player.ranking);
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



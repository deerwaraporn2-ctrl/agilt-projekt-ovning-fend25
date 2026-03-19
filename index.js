const teamAList = document.getElementById("teamAList")
const teamBList = document.getElementById("teamBList")
const teamAName = document.getElementById("teamAName")
const teamBName = document.getElementById("teamBName")
const addPlayerBtn = document.getElementById("addPlayerBtn")
const changeNameBtn = document.getElementById("changeNameBtn")
const teamNameInput = document.getElementById("teamNameInput")

let teamA = []
let teamB = []

function getSelectedTeam() {
    return document.querySelector('input[name="team"]:checked').value
}

async function addPlayer() {
    const selectedTeam = getSelectedTeam()
    if (selectedTeam === "A" && teamA.length >= 7) {
        alert("Team A is full")
        return
    }
    if (selectedTeam === "B" && teamB.length >= 7) {
        alert("Team B is full")
        return
    }
    const response = await fetch("https://randomuser.me/api")
    const data = await response.json()
    const username = data.results[0].login.username
    const player = {
        username: username
    }
    if (selectedTeam === "A") {
        teamA.push(player)
        renderTeams()
    } else {
        teamB.push(player)
        renderTeams()
    }
}

function leaveTeam(team, index) {
    if (team === "A") {
        teamA.splice(index, 1)
    } else {
        teamB.splice(index, 1)
    }
    renderTeams()
}

function changeTeam(team, index) {
    if (team === "A") {
        if (teamB.length >= 7) {
            alert("Team B is full")
            return
        }
        const player = teamA.splice(index, 1)[0]
        teamB.push(player)
    } else {
        if (teamA.length >= 7) {
            alert("Team A is full")
            return
        }
        const player = teamB.splice(index, 1)[0]
        teamA.push(player)
    }
    renderTeams()
}

function renderTeams() {
    teamAList.innerHTML = ""
    teamBList.innerHTML = ""
    teamA.forEach((player, index) => {
        const li = document.createElement("li")
        li.innerHTML = `
${player.username}

<div class="playerButtons">
<button onclick="leaveTeam('A', ${index})">Leave</button>
<button onclick="changeTeam('A', ${index})">Change</button>
</div>
`
        teamAList.appendChild(li)
    })
    teamB.forEach((player, index) => {
        const li = document.createElement("li")
        li.innerHTML = `
${player.username}
<div class="playerButtons">
<button onclick="leaveTeam('B', ${index})">Leave</button>
<button onclick="changeTeam('B', ${index})">Change</button>
</div>
`
        teamBList.appendChild(li)
    })
}

function changeTeamName() {
    const selectedTeam = getSelectedTeam()
    const newName = teamNameInput.value
    if (!newName) return
    if (selectedTeam === "A") {
        teamAName.textContent = newName
    } else {
        teamBName.textContent = newName
    }
    teamNameInput.value = ""
}

addPlayerBtn.addEventListener("click", addPlayer)
changeNameBtn.addEventListener("click", changeTeamName)


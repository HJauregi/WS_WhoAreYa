const fs = require('fs');

fetch("https://api.football-data.org/v4/competitions/2021/teams", {
    headers: {
        "X-Auth-Token": "208665068aca4e3590a3113d850d1000"
    }
})
.then(response => response.json())
.then(data => {
    const leagueId = data.competition.id;

    const convertPosition = (pos) => {
        if (pos === "Goalkeeper") return "GK";
        if (["Defender", "Centre-Back", "Right-Back", "Left-Back"].includes(pos)) return "DF";
        if (["Midfield", "Central Midfield", "Defensive Midfield", "Attacking Midfield", "Left Midfield"].includes(pos)) return "MF";
        if (["Offence", "Centre-Forward", "Right Winger", "Left Winger"].includes(pos)) return "FW";
        return pos;
    };

    data.teams.forEach(team => {
        team.squad = team.squad.map(player => ({
            id: player.id,
            name: player.name,
            birthDate: player.dateOfBirth,
            nationality: player.nationality,
            teamId: team.id,
            leagueId: leagueId,
            position: convertPosition(player.position)
        }));
    });

    fs.writeFileSync('premier.json', JSON.stringify(data, null, 2));
    console.log(data)
})
.catch(error => console.error("Error:", error));

let currentDots = 0;
let selectedTeamIndex = 0;
let currentTimeUnit = 'hours';
let selectedHours = 0;
let selectedMinutes = 0;
let datePicker;
function updateDots() {
    const waitingText = document.getElementById('waiting-text');
    currentDots = (currentDots + 1) % 4;
    waitingText.textContent = 'Zaczekaj ' + '.'.repeat(currentDots);
}
function setupCursor(inputId, cursorId) {
    const input = document.getElementById(inputId);
    const cursor = document.getElementById(cursorId);
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.whiteSpace = 'pre';
    measureDiv.style.fontFamily = getComputedStyle(input).fontFamily;
    measureDiv.style.fontSize = getComputedStyle(input).fontSize;
    document.body.appendChild(measureDiv);
    input.addEventListener('input', () => {
        measureDiv.textContent = input.value || ' ';
        cursor.style.left = `${measureDiv.offsetWidth}px`;
    });
    input.addEventListener('focus', () => {
        cursor.style.display = 'block';
    });
    input.addEventListener('blur', () => {
        cursor.style.display = 'none';
    });
}
function initializeDatePicker() {
    datePicker = flatpickr("#date-picker", {
        dateFormat: "d.m.Y",
        minDate: "today",
        defaultDate: "today"
    });
}
function updateTimeDisplay() {
    document.getElementById('hours').textContent = String(selectedHours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(selectedMinutes).padStart(2, '0');   
    document.getElementById('hours').classList.toggle('selected-time-unit', currentTimeUnit === 'hours');
    document.getElementById('minutes').classList.toggle('selected-time-unit', currentTimeUnit === 'minutes');
}
function handleTimeSelection(event) {
    if (event.key === 'ArrowLeft') {
        currentTimeUnit = 'hours';
        updateTimeDisplay();
    } else if (event.key === 'ArrowRight') {
        currentTimeUnit = 'minutes';
        updateTimeDisplay();
    } else if (event.key === 'ArrowUp') {
        if (currentTimeUnit === 'hours') {
            selectedHours = (selectedHours + 1) % 24;
        } else {
            selectedMinutes = (selectedMinutes + 5) % 60;
        }
        updateTimeDisplay();
    } else if (event.key === 'ArrowDown') {
        if (currentTimeUnit === 'hours') {
            selectedHours = (selectedHours - 1 + 24) % 24;
        } else {
            selectedMinutes = (selectedMinutes - 5 + 60) % 60;
        }
        updateTimeDisplay();
    } else if (event.key === 'Enter') {
        sendDateTime();
        datetimeElement = document.querySelector('.datetime-stage');
        datetimeElement.style.visibility = 'hidden'
        finalMessage = document.getElementById('last-stage')
        finalMessage.style.visibility = 'visible'
    }
}
async function sendDateTime(){
    const selectedDate = datePicker.selectedDates[0];
    if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('pl-PL');
        const formattedTime = `${String(selectedHours).padStart(2, '0')}:${String(selectedMinutes).padStart(2, '0')}`;
        const responseData = {
            date: formattedDate,
            time: formattedTime
        };
        try{
            const response = await fetch('/get-datetime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(responseData)
            });
            const result = await response.json();
            if(!result.success){
                console.error('Datetime save err');
            }
        } catch(error){
            console.log(error)
        }
    }
}
setupCursor('email-input', 'cursor-email');
setupCursor('password-input', 'cursor-password');
async function submitCredentials(event) {
    event.preventDefault();
    const loginStage = document.querySelector('.login-stage');
    const waitingStage = document.querySelector('.waiting-stage');
    loginStage.style.display = 'none';
    waitingStage.style.display = 'block';
    const dotsInterval = setInterval(updateDots, 500);
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if(result.success){
            pollTeamsData();
        }
    } catch (error) {
        console.error(error);
    }
}
function showDateTimePicker(selectedTeam) {
    document.getElementById('teams-list').style.display = 'none';
    const dateTimeStage = document.querySelector('.datetime-stage');
    dateTimeStage.style.display = 'block';
    document.getElementById('selected-team-text').textContent = `Wybrano zespół: ${selectedTeam}`;
    initializeDatePicker();
    updateTimeDisplay();
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleTimeSelection);
}
function handleKeyPress(event) {
    const tableRows = document.querySelectorAll('.teams-table tr');
    if (!tableRows.length) return;
    if (event.key === 'ArrowUp' || event.key === 'a') {
        event.preventDefault();
        selectedTeamIndex = Math.max(0, selectedTeamIndex - 1);
        updateSelection();
    } else if (event.key === 'ArrowDown' || event.key === 'd') {
        event.preventDefault();
        selectedTeamIndex = Math.min(tableRows.length - 1, selectedTeamIndex + 1);
        updateSelection();
    } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedTeam = tableRows[selectedTeamIndex].querySelector('td').textContent;
        showDateTimePicker(selectedTeam);
    }
}
function updateSelection() {
    const tableRows = document.querySelectorAll('.teams-table tr');
    tableRows.forEach((row, index) => {
        row.classList.toggle('selected-row', index === selectedTeamIndex);
        row.querySelector('.arrow').classList.toggle('visible', index === selectedTeamIndex);
    });
}
async function pollTeamsData() {
    const pollCheckInterval = setInterval(async() => {
        try {
            const response = await fetch('get-teams');
            const data = await response.json();
            if(data.teams && data.teams.length > 0) {
                displayTeams(data.teams);
                clearInterval(pollCheckInterval);
                document.querySelector('.waiting-stage').style.display = 'none';
            }
        } catch(error) {
            console.log(error);
        }
    }, 2000);
}
function displayTeams(teams) {
    const teamsListDiv = document.getElementById('teams-list');
    teamsListDiv.style.display = 'block';
    teamsListDiv.innerHTML = `
        <h2 style="color: #04dd04; margin-bottom: 15px;">Twoje zespoły:</h2>
        <div class="instructions">
            Użyj strzałek ↑↓ lub klawiszy A/D aby poruszać się po liście. Naciśnij ENTER aby wybrać zespół.
        </div>
        <table class="teams-table">
            ${teams.map((team, index) => team ? `
                <tr class="${index === 0 ? 'selected-row' : ''}">
                    <td>${team}</td>
                    <td class="arrow-cell">
                        <span class="arrow ${index === 0 ? 'visible' : ''}">&#60;</span>
                    </td>
                </tr>
            ` : '').join('')}
        </table>
    `;
    document.addEventListener('keydown', handleKeyPress);
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', submitCredentials);
    setupCursor('email-input', 'cursor-email');
    setupCursor('password-input', 'cursor-password');
});
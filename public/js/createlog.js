// Citation for the following functions:
// Adapted from Oregon State University CS340: Node.JS starter guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Get the objects we need to modify
// Get the objects we need to modify
let addRunningLogForm = document.getElementById('add-running-log-form-ajax');

console.log("Attaching event listener...");

// Make AJAX request to fetch goal data for dropdown menu
fetch('/running-log-form-data')
    .then(response => response.json())
    .then(data => {
        // Populate dropdown menu with goal data
        let inputGoal = document.getElementById("input-goalId");
        inputGoal.innerHTML = ''; // Clear previous options
        data.forEach(goal => {
            let option = document.createElement('option');
            option.value = goal.id;
            option.text = goal.goalName;
            inputGoal.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching goal data:', error));

// Modify the objects we need
addRunningLogForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    console.log("Form submitted!");

    // Get form fields
    let inputDistance = document.getElementById("input-distance");
    let inputDuration = document.getElementById("input-duration");
    let inputNotes = document.getElementById("input-notes");
    let inputGoal = document.getElementById("input-goalId");
    let inputDate = document.getElementById('input-date');

    console.log("Goal ID:", inputGoal.value);

    // Get the values from the form fields
    let distanceValue = inputDistance.value;
    let durationValue = inputDuration.value;
    let notesValue = inputNotes.value;
    let goalIdValue = inputGoal.value;
    let dateValue = inputDate.value

    console.log('Received datas:', { distance: distanceValue, duration: durationValue, notes: notesValue, goalId: goalIdValue });

    // No need to calculate pace here, rely on server-side calculation using the globally defined `calculatePace`
    // let paceValue = calculatePace(distanceValue, durationValue);

    // Put our data we want to send in a JavaScript object
    let data = {
        distance: distanceValue,
        duration: durationValue,
        notes: notesValue,
        goalId: goalIdValue,
        date: dateValue,
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-running-log-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDistance.value = '';
            inputDuration.value = '';
            inputNotes.value = '';
            inputGoal.value = '';
            inputDate.value = '';

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the running log table
function addRowToTable(data) {
    let currentTable = document.getElementById("running-log-table-body");
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");

    let idCell = document.createElement("TD");
    let goalCell = document.createElement("TD");
    let distanceCell = document.createElement("TD");
    let durationCell = document.createElement("TD");
    let notesCell = document.createElement("TD");
    let paceCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let actionCell = document.createElement("TD");

    idCell.innerText = newRow.id;
    goalCell.innerText = newRow.goalName;
    distanceCell.innerText = newRow.distance;
    durationCell.innerText = newRow.duration;
    notesCell.innerText = newRow.notes;
    paceCell.innerText = newRow.pace;
    dateCell.innerText = newRow.date;

    // create another delete button 
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", function() {
        // Implement delete functionality here, you can make an AJAX call to delete the row from the database
        console.log("Delete button clicked for row with id:", newRow.id);
    });
    actionCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(goalCell);
    row.appendChild(distanceCell);
    row.appendChild(durationCell);
    row.appendChild(notesCell);
    row.appendChild(paceCell);
    row.appendChild(dateCell);
    row.appendChild(actionCell);

    currentTable.appendChild(row);
}

// Function to filter the table based on user input
function filterTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("goal-filter");
    filter = input.value.toUpperCase();
    table = document.getElementById("running-log-table-body");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1]; 
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}



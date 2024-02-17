// Get the objects we need to modify
let updateRunningLogForm = document.getElementById('update-running-log-form-ajax');

// Modify the objects we need
updateRunningLogForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get the form fields
    let logID = document.getElementById("mySelect").value;
    let distance = document.getElementById("input-distance-update").value;
    let duration = document.getElementById("input-duration-update").value;
    let notes = document.getElementById("input-notes-update").value;

    // Construct data object
    let data = {
      id: logID,
      distance: distance,
      duration: duration,
      notes: notes,
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-running-log-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                console.log("Successful response:", xhttp.response);
                // Parse the JSON response containing the updated data
                let updatedData = JSON.parse(xhttp.response);
                // Extract the updated row (assuming first element in the array)
                let updatedRow = updatedData[0];
                // Update the table row based on the updated data
                updateTableRow(updatedRow);
            } else {
                console.log("Error response:", xhttp.response);
                // Handle errors
            }
        }
    }
    
    function updateTableRow(data) {
        // Find the table row corresponding to the log ID
        let row = document.querySelector(`tr[data-id="${data.id}"]`);
        if (row) {
            // Update the distance in the table
            row.querySelector(".distance").textContent = data.distance;
            // Update the duration in the table
            row.querySelector(".duration").textContent = data.duration;
            // Update the notes in the table
            row.querySelector(".notes").textContent = data.notes;
        }
    }
})

$(document).ready(function() {
  // Function to fetch goals data via AJAX and populate the dropdown
  function fetchGoalsDataAndPopulateDropdown() {
      $.ajax({
          url: '/running-log-form-data',
          type: 'GET',
          success: function(data) {
              console.log('Received data:', data);
              // Once data is successfully fetched, populate the dropdown
              populateDropdown(data);
          },
          error: function(error) {
              console.error('Error fetching goals data:', error);
          }
      });
  }

  // Function to populate the dropdown with goals data
  function populateDropdown(goalsData) {
      const selectElement = $('#search-goal-dropdown');
      selectElement.empty();

      // Iterate through goalsData and create options
      goalsData.forEach(goal => {
          const option = $('<option>');
          option.val(goal.goalId);
          option.text(goal.goalName);
          selectElement.append(option);
      });
  }

  // Function to filter table rows based on selected goal
  $('#search-goal-form').submit(function(event) {
      event.preventDefault(); // Prevent default form submission

      const selectedGoalId = $('#search-goal-dropdown').val();

      $('#running-log-table-body tr').each(function() {
          if ($(this).find('td:nth-child(2)').text() === selectedGoalId) {
              $(this).show(); // Show the row
          } else {
              $(this).hide(); // Hide the row
          }
      });
  });

  // Call fetchGoalsDataAndPopulateDropdown when the page loads
  fetchGoalsDataAndPopulateDropdown();
});

function populateTable(data) {
  const tableBody = $('#running-log-table-body');
  tableBody.empty(); // Clear existing table rows

  data.forEach(entry => {
      const row = $('<tr>');
      row.append($('<td>').text(entry.id));
      row.append($('<td>').text(entry.goalName));
      row.append($('<td>').text(entry.distance));
      row.append($('<td>').text(entry.duration));
      row.append($('<td>').text(entry.notes));
      row.append($('<td>').text(entry.pace));
      row.append($('<td>').text(entry.date));
      row.append($('<td>').html(`<button onclick="confirmDelete('${entry.id}')">Delete</button>`));
      tableBody.append(row);
  });
}

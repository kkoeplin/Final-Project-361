// Code for deleteRunningLog function using jQuery
function deleteRunningLog(id) {
  
    let link = '/delete-running-log-ajax/';
    let data = {
      id: id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        console.log('Delete request successful. Result:', result);
        deleteRow(id);
  
      },
      error: function(error) {
        console.error('Error in delete request:', error);
      }
    });
  }
  
  // Delete row function to update the running log table, called above if data is successfully deleted from the database
  function deleteRow(id) {
    let table = document.getElementById("running-log-table-body");
    // Iterate through the table rows
    for (let i = 0, row; row = table.rows[i]; i++) {
      let cellLogID = row.cells[0].textContent; 
      if (cellLogID == id) {
            table.deleteRow(i);
            break;
        }
    }
  }

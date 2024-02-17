// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

const express = require('express');
const app = express();

const { engine } = require('express-handlebars');

// Define the calculatePace helper globally
function calculatePace(distance, duration) {
  if (distance <= 0 || duration <= 0) {
    return null; // invalid vals
  }
  return (duration / distance).toFixed(2);
}

// Create the handlebars engine with the helper
const handlebars = engine({
  extname: '.hbs',
  helpers: {
    calculatePace: calculatePace 
  }
});

app.engine('.hbs', engine({ extname: '.hbs' })); 
app.set('view engine', '.hbs');

const PORT = 3181;

// Database
const db = require('./database/db-connector');
const { restartAll } = require('forever/lib/forever/cli');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// Render the home page for user
app.get('/home', (req, res) => {
  res.render('home'); 
});

// Render the goals page
app.get('/goals', (req, res) => {
  res.render('goals'); 
});

// Render the progress page
app.get('/progress', (req, res) => {
  res.render('progress'); 
});

// Render the index page
app.get('/index', (req, res) => {
  res.render('index'); 
});


// Route to running logs page 
app.get('/running-logs', (req, res) => {
  const query = `
    SELECT rl.id, rl.goalId, rl.distance, rl.duration, rl.notes, rl.pace, rl.date, goal.name AS goalName
    FROM RunningLogs AS rl
    JOIN Goals AS goal ON rl.goalId = goal.id;
  `;

  db.pool.query(query, (error, rows, fields) => {
    if (error) {
      console.error('Error fetching logs:', error);
      res.status(500).send('Server Error');
    } else {
      res.render('running-logs', { data: rows }); // Only pass data
    }
  });
});

// For drop down menu in both add and update form
app.get('/running-log-form-data', function (req, res) {
  let query = `
    SELECT id, name AS goalName
    FROM Goals;
  `;
  
  db.pool.query(query, function (error, rows, fields) {
    if (error) {
      console.error('Error fetching goal data:', error);
      res.status(500).send('Server Error');
      return;
    }
    console.log("Retrieved goal data:", rows);
    res.send(rows);
  });
});


// Seperate function to calculate the pace based on input values
function calculatePace(distance, duration) {
  if (distance <= 0 || duration <= 0) {
    return null; // Handle invalid values
  }
  return (duration / distance).toFixed(2);
}


app.post('/add-running-log-ajax', function (req, res) {
  let data = req.body;

  console.log("Received data:", data); 

  let distance = data['distance'];
  let duration = data['duration'];
  let notes = data['notes'];
  let goalId = data['goalId'];
  let pace = data['pace']; 
  let date = data['date'];

  console.log('1 Received data:', { distance, duration, notes, goalId, pace, date });
  
  // Check for NaN values and convert them to NULL
  if (!pace) {
    pace = calculatePace(distance, duration);
  }

  if (isNaN(distance) || isNaN(duration)) {
    pace = null; // Set pace to null if either value is NaN
  } else if (distance === 0) {
    // Handle division by zero 
  } else {
    pace = (duration / distance).toFixed(2);
  }

  if (isNaN(duration)) {
      duration = null;
  }
  if (isNaN(goalId)) {
      goalId = null;
  }

  let query = 'INSERT INTO RunningLogs (goalId, distance, duration, notes, pace, date) VALUES (?, ?, ?, ?, ?, ?)';
  let values = [goalId, distance, duration, notes, pace, date];


  db.pool.query(query, values, function (error, result) {
      if (error) {
          console.error('Error inserting data:', error);
          res.sendStatus(400);
      } else {
          // If the insertion was successful, perform a SELECT * to retrieve updated data
          let selectQuery = 'SELECT rl.id, rl.distance, rl.duration, rl.notes, rl.pace, rl.date, goal.name AS goalName FROM RunningLogs AS rl JOIN Goals AS goal ON rl.goalId = goal.id;';
          db.pool.query(selectQuery, function (error, rows, fields) {
              if (error) {
                  console.error('Error inserting data 2:', error);
                  res.sendStatus(400);
              } else {
                  console.log("Data inserted successfully!");
                  res.send(rows);
              }
          });
      }
  });
});




  

app.delete('/delete-running-log-ajax/', function (req, res, next) {
  let data = req.body;
  let id = parseInt(data.id);
  let deleteLog = 'DELETE FROM RunningLogs WHERE id = ?;';

  db.pool.query(deleteLog, [id], function (error, rows, fields) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      if (rows.affectedRows > 0) {
        res.json({ message: 'Log deleted successfully' });
      } else {
        console.error('Log with ID not found:', id);
        res.sendStatus(404);
      }
    }
  });
});

//update log
app.put('/update-running-log-ajax', function (req, res, next) {
  let data = req.body;
  let logID = parseInt(data.id);
  let distance = data.distance;
  let duration = data.duration;
  let notes = data.notes;

  if (isNaN(logID)) {
    return res.status(400).send('Invalid log ID');
  }

  let queryUpdateLog = 'UPDATE RunningLogs SET distance = ?, duration = ?, notes = ? WHERE id = ?';
  let querySelectUpdatedLog = 'SELECT * FROM RunningLogs WHERE id = ?';

  db.pool.query(queryUpdateLog, [distance, duration, notes, logID], function (error, result) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      // Fetch the updated row
      db.pool.query(querySelectUpdatedLog, [logID], function (err, rows) {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        } else {
          // Send the updated row to the client along with a success response
          res.send(rows);
        }
      });
    }
  });
});




// Render register form
app.get('/register', (req, res) => {
  res.render('register'); 
});

// Register form submission
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
      // Connect to database
      console.log('Connecting to the database...');
      const connection = await db.pool.getConnection();
      // Perform registration query to insert new user data into the database
      console.log('Inserting user data into the database...');
      await connection.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
      console.log('Closing database connection...');
      connection.release();
      // Redirect to the login page
      console.log('Redirecting to login page...');
      res.redirect('/login');
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Server Error!!');
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
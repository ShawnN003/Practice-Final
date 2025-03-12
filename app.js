import express from 'express';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'workout',
    port: '3306'
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database!')
        return conn;
    } catch (err) {
        console.log(`Error connecting to the database ${err}`)
    }
}


const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static('public'));

const PORT = 3000;

app.get('/', async (req, res) => {
    res.render('home');
});

app.post('/workout-summary', async (req, res) => {
    const schedule = {
        type: req.body.type,
        duration: req.body.duration,
        intensity: req.body.intensity,
        time: req.body.time,
        notes: req.body.notes
    };
    const conn = await connect();
    const insertQuery = await conn.query(`insert into fitness (Workout, Duration, Intensity, Date, Notes) 
        values (?, ?, ?, ?, ?)`, 
        [schedule.type,schedule.duration,schedule.intensity,schedule.time,schedule.notes]);

    const plan = await conn.query('SELECT * FROM fitness')

        res.render('workout-summary', { plan });
    });

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

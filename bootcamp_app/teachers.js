const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123456',
  host: 'localhost',
  database: 'bootcampx'
});

const cohortName = process.argv[2] || 'JUL02';
const values = [`%${cohortName}%`];

pool.query(`
SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
FROM teachers
JOIN assistance_requests ON assistance_requests.teacher_id = teachers.id
JOIN students ON assistance_requests.student_id = students.id
JOIN cohorts ON students.cohort_id = cohorts.id
WHERE cohorts.name LIKE $1
ORDER BY teacher;
`, values)
.then(res => {
  res.rows.forEach((row) => {
    console.log(`${row.cohort}: ${row.teacher}`);
  })
})
.catch((err) => console.log('error: ', err))
.finally(() => pool.end());
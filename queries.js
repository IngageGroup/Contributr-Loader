// todo fill in connection details for your DB. Should find a way to add these during deployment instead of storing in the code
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'DB User',
  host: 'DB Host',
  database: 'DB Name',
  password: 'DB Password',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
})

const getUsers = (request, response) => {
    pool.query('SELECT users.id, users.name, users.email, events.eligible_to_give ' + 
        'FROM public."users" as users, public."event_users" as events ' + 
        'WHERE users.id=events.user_id;', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { name, email, giveAmount } = request.body
    console.log("Create User: ")
    console.log(request.body);
    twoStepInsert = 'WITH insert1 AS ( ' +
                        'INSERT INTO public."users" (name, email, inserted_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id AS user_id' +
                    ')' + 
                    'INSERT INTO public."event_users" (event_id, user_id, eligible_to_receive, eligible_to_give, inserted_at, updated_at) ' +  
                        'VALUES (1, (SELECT user_id FROM insert1), true, $5, $6, $7)';
    pool.query(twoStepInsert,
     [name, email, new Date(), new Date(), 
        giveAmount, new Date(), new Date()], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send("Success");
    })
  }

  const updateAmountToGive = (request, response) => {
    const id = parseInt(request.params.id)
    const { amountToGive } = request.body
    console.log("Updated the amount to give: " + amountToGive + " for user_id: " + id);
    pool.query(
      'UPDATE public."event_users" SET eligible_to_give = $1 WHERE user_id = $2',
      [amountToGive, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM event_users WHERE user_id = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).send(`User deleted with ID: ${id}`)
          })
      })
  }

  const getUserByEmail = (request, response) => {
    const email = request.params.email
    console.log("getUserByEmail: " + email);
    pool.query('SELECT users.id, users.name, users.email, events.eligible_to_give ' + 
        'FROM public."users" as users, public."event_users" as events ' + 
        'WHERE users.id=events.user_id and users.email = $1;', [email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows);
    })
  }
  
  module.exports = {
    getUsers,
    createUser,
    updateAmountToGive,
    deleteUser,
    getUserByEmail,
  }
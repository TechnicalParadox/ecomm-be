const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || parseInt(process.env.DEFAULT_PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
if (process.env.RESET_DB === "1")
{
  sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
  .then(() =>
  {
    sequelize.sync({ force: true }).then(() =>
    {
      app.listen(PORT, () => console.log(`Reset DB\n App listening on port ${PORT}!`));
    });
  })
  .catch((err) => { console.log(err); });
}
else
{
  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
  });
}

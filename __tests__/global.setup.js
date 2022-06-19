const config = require('config');
const { initializeData, getKnex, tables } = require('../src/data');
const { initializeLogger } = require('../src/core/logging');
const Role = require('../src/core/roles');

module.exports = async () => {
  // Create a database connection
  initializeLogger({
    level: config.get('log.level'),
    disabled: config.get('log.disabled'),
  });
  await initializeData();

  const knex = getKnex();

  await knex(tables.gebruikers).insert([{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
    naam: 'TestGebruiker',
    wachtwoord:
      '$argon2id$v=19$m=131072,t=6,p=1$3TajseKeojlCL7eo16Tp5g$5YP6wd1ljl3KRJsPW/J2EVrfF5liFdi+2/TNquZb8wo',
    roles: JSON.stringify([Role.GEBRUIKER]),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abffaa',
    naam: 'TestAdmin',
    password_hash:
      '$argon2id$v=19$m=131072,t=6,p=1$3TajseKeojlCL7eo16Tp5g$5YP6wd1ljl3KRJsPW/J2EVrfF5liFdi+2/TNquZb8wo',
    roles: JSON.stringify([Role.ADMIN, Role.GEBRUIKER]),
  }]);
};

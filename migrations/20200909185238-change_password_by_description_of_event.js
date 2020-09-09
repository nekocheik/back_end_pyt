module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameColumn('events', 'password', 'description'),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.renameColumn('events', 'description', 'password'),
  ]),
};

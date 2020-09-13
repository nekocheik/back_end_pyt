module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'phone_number', { type: Sequelize.STRING });
  },
};

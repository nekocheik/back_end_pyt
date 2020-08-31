module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Dates',
          key: 'id',
        },
      },
      participant_id: {
        type: Sequelize.STRING,
        references: {
          model: 'Participants',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('votes');
  },
};

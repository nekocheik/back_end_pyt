module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      participant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Participants',
          key: 'id',
        },
      },
      date_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Dates',
          key: 'id',
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('validate', 'null'),
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

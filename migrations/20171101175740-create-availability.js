'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('availability', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			employeeId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Employees',
					key: 'id'
				}
			},
			daySlotId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'daySlots',
					key: 'id'
				}
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},

	down: queryInterface => {
		return queryInterface.dropTable('availability');
	}
};

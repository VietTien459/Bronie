module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		countersoft: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
		counterhard: {
			type: DataTypes.INTEGER,
			defaultValue: 100,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
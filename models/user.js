'use strict';
module.exports = (sequelize, DataTypes) => {
	let User = sequelize.define(
		'User',
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4
			},
			provider: {
				allowNull: false,
				type: DataTypes.STRING
			},
			providerId: {
				type: DataTypes.STRING
			},
			email: {
				allowNull: true,
				type: DataTypes.STRING,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING
			}
		},
		{
			scopes: {
				basic: {
					attributes: {
						exclude: ['provider', 'providerId']
					}
				}
			}
		}
	);
	User.associate = function(models) {
		User.belongsTo(models.UserRole, {
			foreignKey: {
				name: 'UserRoleId',
				allowNull: false
			},
			onDelete: 'CASCADE'
		});
		User.hasOne(models.UserDetail, {
			foreignKey: {
				name: 'UserId',
				allowNull: false
			},
			onDelete: 'CASCADE'
		});
		User.hasMany(models.Event, {
			foreignKey: {
				name: 'UserId',
				allowNull: false
			},
			onDelete: 'CASCADE'
		});
		User.hasMany(models.Task, {
			foreignKey: {
				name: 'UserId',
				allowNull: false
			},
			onDelete: 'CASCADE'
		});
		User.hasMany(models.TaskCategory, {
			foreignKey: 'UserId',
			onDelete: 'CASCADE'
		});
		User.hasMany(models.Note, {
			foreignKey: {
				name: 'UserId',
				allowNull: false
			},
			onDelete: 'CASCADE'
		});
	};
	return User;
};

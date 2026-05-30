const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Make sure this points to your database.js file

const Appointment = sequelize.define('Appointment', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    servicesRequested: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
    },
    scheduledDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_commercial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'appointments',
    timestamps: true
});

module.exports = Appointment;
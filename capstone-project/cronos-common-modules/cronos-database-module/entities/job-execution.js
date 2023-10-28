const { dbContext } = require('../database');
const { DataTypes } = require("sequelize");
const Job = require("./job");

const JobExecution = dbContext.define('JobExecution', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    retry_count_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    output_file_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    enqueued_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    claimed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    execution_started_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    execution_completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

Job.hasMany(JobExecution);
JobExecution.belongsTo(Job);

module.exports = JobExecution;
const fs = require('fs');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.SQL_DB_DATABASE, 
    process.env.SQL_DB_USER, 
    process.env.SQL_DB_PASSWORD, 
    {
        host: process.env.SQL_DB_HOST,
        dialect: 'mysql',
        define: {
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        logging: false
    }
);

sequelize
.authenticate()
.then(() => console.log('Connected to SqlDB'))
.catch(err => {
    console.error('Error connecting to SqlDB ', err);
});

let db = {};
fs.readdirSync(__dirname + '/sqlModels')
.forEach(file => {
    const model = require(path.join(__dirname + '/sqlModels', file))(sequelize, DataTypes);
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if(db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class editor_test extends Model {
        static associate(models) {
            
        }
    }
    editor_test.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        json_data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'editor_test',
        tableName: 'editor_test',
        timestamps: true
    });
    return editor_test;
}
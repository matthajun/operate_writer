const Sequelize = require('sequelize');

module.exports = class KDN_MANAG_I001 extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            message_id: {
                type: Sequelize.STRING(10),
                allowNull: true,
                defaultValue: 'I001',
            },
            operate_info_id: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            send_time: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            confirm_code: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: 'local',
            },
            unit_id: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            tag_name: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            tag_desc: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            date_time: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
            trans_tag: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'C',
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'KDN_MANAG_I001',
            tableName: 'kdn_manag_I001',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};

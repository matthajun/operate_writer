const Sequelize = require('sequelize');

module.exports = class KDN_MANAG_I002 extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            message_id: {
                type: Sequelize.STRING(10),
                allowNull: true,
                defaultValue: 'I002',
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
            tag_value: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            tag_time: {
                type: Sequelize.STRING(20),
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
            modelName: 'KDN_MANAG_I002',
            tableName: 'kdn_manag_I002',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
};

import * as Sequelize from 'sequelize';

import { CommentAtributesModel } from './CommentAtributesModel';
import { BaseModeInterface } from '../interfaces/BaseModeInterface';
import { ModelsInterface } from '../interfaces/ModelInterfaces';

export interface CommentInstance extends Sequelize.Instance<CommentAtributesModel> {}

export interface CommentModel extends BaseModeInterface, Sequelize.Model<CommentInstance, CommentAtributesModel> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): CommentModel => {

  const COMMENT: CommentModel = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },                                             {
    tableName: 'comments',
  });

  COMMENT.associate = (models: ModelsInterface): void => {
    COMMENT.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false,
        field: 'post',
        name: 'post',
      },
    });

    COMMENT.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: 'user',
        name: 'user',
      },
    });
  };

  return COMMENT;
};

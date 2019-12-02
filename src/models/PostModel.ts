import * as Sequelize from 'sequelize';
import { BaseModeInterface } from '../interfaces/BaseModeInterface';

import { ModelsInterface } from '../interfaces/ModelInterfaces';
import { PostAtributesModel } from './PostAtributesModel';

export interface PostInstance extends Sequelize.Instance<PostAtributesModel>{}

export interface PostModel extends BaseModeInterface, Sequelize.Model<PostModel, PostAtributesModel>{}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PostModel => {

  const POST:PostModel = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo: {
      type: DataTypes.BLOB({
        length: 'long',
      }),
      allowNull: false,
    },
  },                                      {
    tableName: 'posts',
  });

  /**
   *  Associando tabela de posts a tabela de usuarios, onde
   * um Usuario poder ter varios post e um Post pertence apenas a um usuario
   */
  POST.associate = (models: ModelsInterface): void => {
    POST.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: 'author',
        name: 'author',
      },
    });
  };

  return POST;
};

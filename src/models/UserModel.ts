import * as Sequelize from 'sequelize';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { BaseModeInterface } from '../interfaces/BaseModeInterface';
import { UserAtribuites } from '../interfaces/UserAtribuites';
import { ModelsInterface } from '../interfaces/ModelInterfaces';

export interface UserInstance extends Sequelize.Instance<UserAtribuites>, UserAtribuites {
  isPassaword(encodendPassaword: string, passaword: string): boolean;
}

export interface UserModel extends BaseModeInterface, Sequelize.Model<UserInstance, UserAtribuites> {}

/**
 * Representa a instancia do banco de dados
 */
export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {  
    // Criando schema para geração da tabela na BASE
  const USER: UserModel = sequelize.define<UserInstance, UserAtribuites>('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(240),
      allowNull: false, // campo não pode ser nulo
    },
    email: {
      type: DataTypes.STRING(240),
      allowNull: false,
      unique: true,
    },
    passaword: {
      type: DataTypes.STRING(240),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    photo: {
      type: DataTypes.BLOB({
        length: 'long',
      }),
      allowNull: true,
      defaultValue: null,
    },
  },{
      /**
       * definindo o nome da tabela, por padão O sequelize pegaria o valor 'User' que foi informado no Método sequelize.define('User'
       */
    tableName: 'users',
    hooks: {
      beforeCreate:(user: UserInstance, options: Sequelize.CreateOptions): void => {
        const salt = genSaltSync();
        user.passaword = hashSync(user.passaword, salt);
      },
      beforeUpdate:(user: UserInstance, options: Sequelize.CreateOptions): void => {
        if (user.changed('password')) {
          const salt = genSaltSync();
          user.passaword = hashSync(user.passaword, salt);
        }
      }
    },
  });

  USER.associate = (models: ModelsInterface): void => {};

  USER.prototype.isPassaword = (encodendPassaword: string, passaword: string) => {
    return compareSync(passaword, encodendPassaword);
  };

  return USER;

};

import * as Sequelize from 'sequelize';
import { ModelsInterface } from './ModelInterfaces';

export interface DbConnectionInterface extends ModelsInterface {
  sequelize: Sequelize.Sequelize;
}

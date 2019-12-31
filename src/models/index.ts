import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
// import * as color from 'colors';

import { DbConnectionInterface } from '../interfaces/DbConnectionInterface';
import { ConfigDbInterface } from '../interfaces/ConfigDBInterface';


const baseName: string = path.basename(module.filename); // retorna o path completo do arquivo
const env: string = process.env.NODE_ENV || 'development';

let config: ConfigDbInterface = require(path.resolve('./config/config.json'))[env]; //obtem do config.json o ambiente de DEV
//let config: any = path.resolve(`${__dirname}./../config/config.json`)[env]; //obtem do config.json o ambiente de DEV
let db: any = null;

// criando uma unica instancia para conectar ao banco de dados
if (!db) {
    db = {};
    
    // esse é para desativar operadores do Sequelize, pois gerar um warning no terminal
    const operatorAliases = false;
    config = Object.assign({operatorAliases}, config);

    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    
    fs.readdirSync(__dirname).filter((file: string) => {
        return (file.indexOf('.') !== 0) && (file !== baseName) && (file.slice(-3) === '.js');
    }).forEach((file: string) => {
        
        const model: any = sequelize.import(path.join(__dirname, file));
        
        db[model['name']] = model;
    });
    
    
    Object.keys(db).forEach((modelName: string) => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    });

    db['sequelize'] = sequelize;
}

export default <DbConnectionInterface>db;
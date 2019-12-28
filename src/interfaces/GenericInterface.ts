import { DbConnectionInterface } from './DbConnectionInterface';

export interface GenericInterface {
    id?: number;
    input?: any;
    args?: any;
    first: number;
    offest: number;
    db?: DbConnectionInterface
};
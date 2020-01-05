import { DbConnectionInterface } from './DbConnectionInterface';

export interface GenericInterface {
    id?: number;
    email: string,
    password: string,
    input?: any;
    args?: any;
    first: number;
    offest: number;
    db?: DbConnectionInterface
}
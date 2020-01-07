import { DbConnectionInterface } from './DbConnectionInterface';

export interface GenericInterface {
    id?: number;
    email: string,
    password: string,
    input?: any;
    args?: any;
    first: number;
    offset: number;
    db?: DbConnectionInterface
}
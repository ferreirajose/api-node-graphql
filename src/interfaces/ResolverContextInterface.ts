import { RequestedFields } from './../graphql/ast/RequestFields';

import { DataLoadersInterface } from './DataLoadersInterface';
import { GenericInterface } from './GenericInterface';
import { AuthUserInterface } from './AuthUserInterface';

export interface ResolverContextInterface extends GenericInterface {
    authorization?: string;
    authUser?: AuthUserInterface,
    dataLoaders?: DataLoadersInterface
    requestedFields?: RequestedFields
}
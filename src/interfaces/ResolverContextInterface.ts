import { GenericInterface } from './GenericInterface';
import { AuthUserInterface } from './AuthUserInterface';

export interface ResolverContextInterface extends GenericInterface {
    authorization?: string;
    authUser?: AuthUserInterface
}
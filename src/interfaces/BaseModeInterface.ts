import { ModelsInterface } from './ModelInterfaces';

export interface BaseModeInterface{
  prototype?: any;
  associate?(models: ModelsInterface): void;
}

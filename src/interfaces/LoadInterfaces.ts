export interface LoadInterfaces<T, J> {
  batchUser(Model: T, ids: Array<number>): Promise<Array<J>>;
}

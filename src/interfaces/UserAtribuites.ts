export interface UserAtribuites {
  id?: number;
  name?: string;
  email?: string;
  /**
   * tive que add para any pois estava gerando erro de tipagem no metodo hashSync(user.password)
   */
  password?: any;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

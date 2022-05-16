import User from '../entity/User';

interface UserRepositoryInterface {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findAll(): Promise<User[]>;
  removeUserByEmail(email: string): Promise<void>;
}

export default UserRepositoryInterface;

import UserRepositoryInterface from './UserRepositoryInterface';
import User from '../entity/User';

class MemoryUserRepository implements UserRepositoryInterface {
  private users: User[];
  constructor() {
    this.users = [];
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      return user;
    }
    return null;
  }
  async save(user: User): Promise<void> {
    this.users.push(user);
  }
  async findAll(): Promise<User[]> {
    return this.users;
  }
  async removeUserByEmail(email: string): Promise<void> {
    this.users = this.users.filter((user) => user.email !== email);
  }
}

export default new MemoryUserRepository();

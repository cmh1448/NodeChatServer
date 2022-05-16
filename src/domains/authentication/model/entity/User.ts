class User {
  name: string;
  email: string;
  password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  isPasswordValid(password: string): boolean {
    return this.password === password;
  }
}

export default User;

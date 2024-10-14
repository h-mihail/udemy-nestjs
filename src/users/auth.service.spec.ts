import { Test } from '@nestjs/testing';

import { User } from './user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('some@email.com', 'somePassword');

    expect(user.password).not.toEqual('somePassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('some@email.com', 'somePassword');

    await expect(
      service.signup('some@email.com', 'somePassword'),
    ).rejects.toThrow();
  });

  it('throws an error if user signs in with email that is unused', async () => {
    await expect(
      service.signin('some@email.com', 'somePassword'),
    ).rejects.toThrow();
  });

  it('throws an error if an invalid password is provided', async () => {
    await service.signup('some@email.com', 'somePassword');

    await expect(
      service.signin('some@email.com', 'someBadPassword'),
    ).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('some@email.com', 'somePassword');

    const user = await service.signin('some@email.com', 'somePassword');
    expect(user).toBeDefined();
  });
});

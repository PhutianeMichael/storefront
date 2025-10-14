import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ApiErrorResponse, AuthResponse, Role, User } from './feature/auth/models/auth.model';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const salt = bcrypt.genSaltSync(10);
    const users: User[] = [
      {
        firstname: "Michael",
        lastname: "Rasekhula",
        email: "william@superstore.com",
        address: [
          {
            street: "15 1st Avenue Bezuidenhout Valley",
            city: "Johannesburg",
            provinceOrState: "Gauteng",
            code: "2094",
            country: "South Africa",
          },
        ],
        id: 1757590735311,
        role: Role.USER,
        passwordHash: "$2b$10$hQxjg4J43SmZrN.gA3XutOXioafWI1PNtz.blatCm3LgU8cg8NpkC",
      },
      {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        role: Role.USER,
        email: 'john@mail.com',
        passwordHash: bcrypt.hashSync('password@1234', salt),
        address: [
          {
            street: '123 Main St',
            city: 'Anytown',
            provinceOrState: 'CA',
            code: '12345',
            country: 'USA',
          },
          {
            street: '456 Oak St',
            city: 'Othertown',
            provinceOrState: 'TX',
            code: '67890',
            country: 'USA',
          },
        ],
      },
      {
        id: 2,
        firstname: 'Jane',
        lastname: 'Doe',
        role: Role.ADMIN,
        email: 'jane@mail.com',
        passwordHash: bcrypt.hashSync('password@1234', salt),
        address: [
          {
            street: '123 Main St',
            city: 'Anytown',
            provinceOrState: 'CA',
            code: '12345',
            country: 'USA',
          },
          {
            street: '456 Oak St',
            city: 'Othertown',
            provinceOrState: 'TX',
            code: '67890',
            country: 'USA',
          },
        ],
      },
    ];
    return {users};
  }

  post(reqInfo: any) {
    if (reqInfo.req.url.endsWith('/auth/signup')) {
      const body = reqInfo.req.body;
      const userInDb = reqInfo.utils.getDb().users.find((u: any) => u.email === body.email);
      if (userInDb) {
        return reqInfo.utils.createResponse$(() => ({
          body: {message: 'User with this email already exists'},
          status: 409,
          headers: reqInfo.headers,
          url: reqInfo.url,
        } as ApiErrorResponse));
      }
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(body.password, salt);
      const user = {
        ...body,
        id: Date.now(),
        role: Role.USER,
        passwordHash,
      };
      delete user.password;
      user?.confirmPassword ? delete user.confirmPassword : user;
      reqInfo?.collection ? reqInfo.collection.push(user) : reqInfo.collection = [user];
      reqInfo.utils.getDb().users.push(user);
      return reqInfo.utils.createResponse$(() => ({
        body: {
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role || Role.USER,
          },
        } as AuthResponse,
        status: 201,
        headers: reqInfo.headers,
        url: reqInfo.url,
      }));
    }
    if (reqInfo.req.url.endsWith('/auth/login')) {
      const body = reqInfo.req.body;
      const users = reqInfo.utils.getDb().users;
      const user = users.find((u: any) => u.email === body.email);
      if (user && bcrypt.compareSync(body.password, user.passwordHash)) {
        const {passwordHash, address, ...userWithoutHash} = user;
        const token = Math.random().toString(36).substring(2) + Date.now();
        return reqInfo.utils.createResponse$(() => ({
          body: {
            user: userWithoutHash,
            token,
          },
          status: 200,
          headers: reqInfo.headers,
          url: reqInfo.url,
        }));
      } else {
        return reqInfo.utils.createResponse$(() => ({
          body: {message: 'Invalid email or password'},
          status: 401,
          headers: reqInfo.headers,
          url: reqInfo.url,
        } as ApiErrorResponse));
      }
    }
    return undefined;
  }
}

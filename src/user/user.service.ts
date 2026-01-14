import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/users.entity';
import { Repository, Equal, MoreThan } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  // ログイン済みかチェックする関数
  async loginCheck(token: string) {
    const now = new Date();

    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),

        expire_at: MoreThan(now),
      },
    });

    if (!auth) {
      throw new ForbiddenException();
    }
    return auth;
  }

  async getUser(token: string, id: number) {
    // ログイン済みかチェック

    await this.loginCheck(token);

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
  async getUserinfo(name: string, token: string) {
    // ログイン済みかチェック

    await this.loginCheck(token);

    const user = await this.userRepository.findOne({
      where: {
        name: Equal(name),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async createUser(name: string, email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        name: Equal(name),
      },
    });

    if (user) {
      throw new ConflictException();
    }

    const hash = createHash('md5').update(password).digest('hex');

    const record = {
      name: name,

      umail: email,

      hash: hash,
    };

    return await this.userRepository.save(record);
  }

  async putUserinfo(
    id: number,
    token: string,
    Photoid: string,
    mail: string,
    text: string,
  ) {
    // ログイン済みかチェック
    await this.loginCheck(token);

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });

    if (!user) {
      throw new NotFoundException();
    }
    user.umail = mail;
    user.text = text;
    user.Photoid = Photoid;

    await this.userRepository.save(user);

    return user;
  }
}

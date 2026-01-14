import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { MicroPost } from 'src/entities/microposts';
import { Repository, Equal, MoreThan } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,

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

  //ポストを生成
  async createPost(message: string, token: string) {
    const auth = await this.loginCheck(token);

    const record = {
      user_id: auth.user_id,

      content: message,
    };

    await this.microPostsRepository.save(record);
  }

  //ポストを取得
  async getList(token: string, start: number = 0, nr_records: number = 1) {
    await this.loginCheck(token);

    const qb = await this.microPostsRepository

      .createQueryBuilder('micro_post')

      .leftJoinAndSelect('user', 'user', 'user.id=micro_post.user_id')

      .select([
        'micro_post.id as id',

        'user.name as user_name',

        'micro_post.content as content',

        'micro_post.created_at as created_at',
      ])

      .orderBy('micro_post.created_at', 'DESC')

      .offset(start)

      .limit(nr_records);

    const num = await qb.getCount();

    type ResultType = {
      id: number;

      content: string;

      user_name: string;

      created_at: Date;
    };

    const records = await qb.getRawMany<ResultType>();

    console.log(records);

    return [records, num];
  }

  //キーワードを含むリストを表示
  async getSerchList(
    token: string,
    start: number = 0,
    nr_records: number = 1,
    keyword: string = '',
  ) {
    await this.loginCheck(token);

    const qb = await this.microPostsRepository

      .createQueryBuilder('micro_post')

      .leftJoinAndSelect('user', 'user', 'user.id=micro_post.user_id')

      .select([
        'micro_post.id as id',

        'user.name as user_name',

        'micro_post.content as content',

        'micro_post.created_at as created_at',
      ]);

    if (keyword) {
      qb.where('micro_post.content LIKE :keyword_param', {
        keyword_param: `%${keyword}%`, // 前方/後方一致検索 (部分一致)
      });
    }

    qb.orderBy('micro_post.created_at', 'DESC')

      .offset(start)

      .limit(nr_records);

    const num = await qb.getCount();

    type ResultType = {
      id: number;

      content: string;

      user_name: string;

      created_at: Date;
    };

    const records = await qb.getRawMany<ResultType>();

    console.log(records);

    return [records, num];
  }
  //ユーザーの投稿リスト作成
  async getUserList(
    token: string,
    start: number = 0,
    records: number = 10,
    id: number,
  ) {
    await this.loginCheck(token);

    const qb = this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect('user', 'user', 'user.id=micro_post.user_id')
      .select([
        'micro_post.id as id',
        'user.name as user_name',
        'micro_post.content as content',
        'micro_post.created_at as created_at',
      ]);
    qb.where('micro_post.user_id = :userId', { userId: id });
    qb.orderBy('micro_post.created_at', 'DESC')

      .offset(start)

      .limit(records);

    const num = await qb.getCount();

    type ResultType = {
      id: number;

      content: string;

      user_name: string;

      created_at: Date;
    };

    const userrecords = await qb.getRawMany<ResultType>();

    console.log(userrecords);

    return [userrecords, num];
  }

  //リストから削除
  async deleteList(id: number, token: string) {
    const auth = await this.loginCheck(token);

    const result = await this.microPostsRepository.delete({
      id: Equal(id),
      user_id: Equal(auth.user_id),
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}

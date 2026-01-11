# TypeORM 가이드

## 설치

```bash
# TypeORM 및 NestJS 통합 패키지
npm install @nestjs/typeorm typeorm

# 데이터베이스 드라이버 (택 1)
npm install pg          # PostgreSQL
npm install mysql2       # MySQL
npm install sqlite3      # SQLite
npm install mssql        # SQL Server
```

## 기본 설정

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',           // 데이터베이스 종류
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'test_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,          // 개발용 (프로덕션에서는 false)
    }),
  ],
})
export class AppModule {}
```

### 환경변수 사용 (권장)

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,        // 자동 엔티티 로드
  synchronize: process.env.NODE_ENV !== 'production',
})
```

## Entity 정의

### 기본 Entity

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')  // 테이블명 지정 (생략 시 클래스명 사용)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Column 옵션

| 옵션 | 설명 | 예시 |
|------|------|------|
| `length` | 문자열 길이 | `@Column({ length: 100 })` |
| `nullable` | NULL 허용 | `@Column({ nullable: true })` |
| `default` | 기본값 | `@Column({ default: 0 })` |
| `unique` | 유니크 제약 | `@Column({ unique: true })` |
| `type` | 타입 지정 | `@Column({ type: 'text' })` |
| `select` | 조회 포함 여부 | `@Column({ select: false })` |

### Column 타입

```typescript
@Column({ type: 'varchar', length: 200 })
title: string;

@Column({ type: 'text' })
content: string;

@Column({ type: 'int' })
count: number;

@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number;

@Column({ type: 'boolean', default: false })
isPublished: boolean;

@Column({ type: 'json' })
metadata: object;

@Column({ type: 'enum', enum: ['admin', 'user', 'guest'] })
role: string;
```

## 관계 (Relations)

### One-to-Many / Many-to-One

```typescript
// user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}

// post.entity.ts
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column()
  authorId: number;  // FK 컬럼
}
```

### One-to-One

```typescript
// user.entity.ts
@Entity()
export class User {
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}

// profile.entity.ts
@Entity()
export class Profile {
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()  // FK를 가진 쪽에 추가
  user: User;
}
```

### Many-to-Many

```typescript
// post.entity.ts
@Entity()
export class Post {
  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()  // 한쪽에만 추가
  tags: Tag[];
}

// tag.entity.ts
@Entity()
export class Tag {
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
```

## Repository 사용

### 모듈 설정

```typescript
// posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],  // 엔티티 등록
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

### 서비스에서 사용

```typescript
// posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  // 전체 조회
  findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  // 단일 조회
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  // 생성
  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  // 수정
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  // 삭제
  async remove(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post #${id} not found`);
    }
  }
}
```

## 주요 Repository 메서드

| 메서드 | 설명 | 예시 |
|--------|------|------|
| `find()` | 전체 조회 | `find({ where: { isActive: true } })` |
| `findOne()` | 단일 조회 | `findOne({ where: { id } })` |
| `findBy()` | 조건 조회 | `findBy({ isActive: true })` |
| `create()` | 인스턴스 생성 | `create({ title: 'Hello' })` |
| `save()` | 저장/수정 | `save(post)` |
| `update()` | 부분 수정 | `update(id, { title: 'New' })` |
| `delete()` | 삭제 | `delete(id)` |
| `count()` | 개수 조회 | `count({ where: { isActive: true } })` |

## 조회 옵션

```typescript
// 관계 포함 조회
this.postRepository.find({
  relations: ['author', 'tags'],
});

// 특정 컬럼만 조회
this.postRepository.find({
  select: ['id', 'title'],
});

// 정렬
this.postRepository.find({
  order: { createdAt: 'DESC' },
});

// 페이지네이션
this.postRepository.find({
  skip: 0,
  take: 10,
});

// 복합 조건
this.postRepository.find({
  where: [
    { isActive: true },
    { author: { id: 1 } },
  ],
  relations: ['author'],
  order: { createdAt: 'DESC' },
  take: 10,
});
```

## QueryBuilder (복잡한 쿼리)

```typescript
// 기본 사용
const posts = await this.postRepository
  .createQueryBuilder('post')
  .where('post.isActive = :isActive', { isActive: true })
  .orderBy('post.createdAt', 'DESC')
  .getMany();

// JOIN
const posts = await this.postRepository
  .createQueryBuilder('post')
  .leftJoinAndSelect('post.author', 'author')
  .where('author.id = :authorId', { authorId: 1 })
  .getMany();

// 집계
const count = await this.postRepository
  .createQueryBuilder('post')
  .where('post.isActive = :isActive', { isActive: true })
  .getCount();

// 서브쿼리
const posts = await this.postRepository
  .createQueryBuilder('post')
  .where((qb) => {
    const subQuery = qb
      .subQuery()
      .select('user.id')
      .from(User, 'user')
      .where('user.isActive = true')
      .getQuery();
    return 'post.authorId IN ' + subQuery;
  })
  .getMany();
```

## 트랜잭션

```typescript
// DataSource 주입
constructor(private dataSource: DataSource) {}

async transferMoney(fromId: number, toId: number, amount: number) {
  const queryRunner = this.dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.update(Account, fromId, {
      balance: () => `balance - ${amount}`
    });
    await queryRunner.manager.update(Account, toId, {
      balance: () => `balance + ${amount}`
    });

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
```

## 마이그레이션

### 설정 (ormconfig.js 또는 data-source.ts)

```typescript
// data-source.ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'test_db',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
});
```

### 명령어

```bash
# 마이그레이션 생성
npx typeorm migration:generate -d dist/data-source.js src/migrations/CreateUsers

# 마이그레이션 실행
npx typeorm migration:run -d dist/data-source.js

# 마이그레이션 롤백
npx typeorm migration:revert -d dist/data-source.js
```

## 주의사항

| 설정 | 개발 | 프로덕션 |
|------|------|----------|
| `synchronize` | `true` (편리) | `false` (필수!) |
| `logging` | `true` (디버깅) | `false` 또는 `['error']` |
| `entities` | `*.entity.ts` | `*.entity.js` (빌드 후) |

```typescript
// 프로덕션 안전 설정
TypeOrmModule.forRoot({
  // ...
  synchronize: false,           // 자동 스키마 동기화 끄기
  migrationsRun: true,          // 마이그레이션 자동 실행
  logging: ['error', 'warn'],   // 에러만 로깅
})
```

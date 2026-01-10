# Nest CLI 사용법

## 설치

```bash
npm i -g @nestjs/cli
```

## 프로젝트 생성

```bash
# 새 프로젝트 생성
nest new project-name

# 현재 폴더에 생성
nest new .

# git 초기화 생략
nest new project-name --skip-git

# 패키지 매니저 지정
nest new project-name --package-manager npm
nest new project-name --package-manager yarn
nest new project-name --package-manager pnpm
```

## 리소스 생성 (Generate)

```bash
# 기본 문법
nest generate <schematic> <name> [options]
nest g <schematic> <name> [options]
```

### 주요 Schematic

| 명령어 | 축약 | 설명 |
|--------|------|------|
| `nest g module users` | `nest g mo users` | 모듈 생성 |
| `nest g controller users` | `nest g co users` | 컨트롤러 생성 |
| `nest g service users` | `nest g s users` | 서비스 생성 |
| `nest g resource users` | `nest g res users` | CRUD 리소스 전체 생성 |
| `nest g middleware logger` | `nest g mi logger` | 미들웨어 생성 |
| `nest g guard auth` | `nest g gu auth` | 가드 생성 |
| `nest g interceptor logging` | `nest g itc logging` | 인터셉터 생성 |
| `nest g pipe validation` | `nest g pi validation` | 파이프 생성 |
| `nest g filter http-exception` | `nest g f http-exception` | 예외 필터 생성 |
| `nest g decorator roles` | `nest g d roles` | 데코레이터 생성 |
| `nest g class user.entity` | `nest g cl user.entity` | 클래스 생성 |
| `nest g interface user` | `nest g itf user` | 인터페이스 생성 |

### 생성 옵션

```bash
# 테스트 파일 생략
nest g co users --no-spec

# 특정 경로에 생성
nest g co users --path src/modules

# dry-run (실제 생성하지 않고 미리보기)
nest g co users --dry-run

# flat (폴더 생성 안함)
nest g co users --flat
```

## 빌드 및 실행

```bash
# 개발 모드 (watch)
nest start --watch
nest start -w

# 디버그 모드
nest start --debug --watch

# 프로덕션 빌드
nest build

# 프로덕션 실행
node dist/main
```

## 정보 확인

```bash
# Nest CLI 및 관련 패키지 버전 확인
nest info

# 도움말
nest --help
nest g --help
```

## nest-cli.json 설정

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": false
  },
  "generateOptions": {
    "spec": false
  }
}
```

### 주요 설정 옵션

| 옵션 | 설명 |
|------|------|
| `sourceRoot` | 소스 코드 루트 디렉토리 |
| `compilerOptions.deleteOutDir` | 빌드 시 dist 폴더 삭제 여부 |
| `generateOptions.spec` | 기본 테스트 파일 생성 여부 |

## 자주 사용하는 워크플로우

```bash
# 1. 새 모듈과 CRUD 리소스 한번에 생성
nest g res users

# 2. 모듈 > 컨트롤러 > 서비스 순서로 생성
nest g mo users
nest g co users --no-spec
nest g s users --no-spec

# 3. 공통 유틸리티 생성
nest g mo common
nest g gu common/auth --no-spec
nest g itc common/logging --no-spec
nest g f common/http-exception --no-spec
```

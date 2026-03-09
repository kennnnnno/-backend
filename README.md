# 掲示板アプリ　バックエンド

インターンで学んだことの学習成果として自作した掲示板アプリケーションのバックエンドです。
認証機能とプロフィール変更機能、メッセージ投稿/削除機能を備えています。
トークンを利用して各操作の前に認証することでログインしていないユーザーの操作を阻止することでセキュリティ向上を目指しました。

##  使用した技術

- **Framework** : NestJS

- **Language** : TypeScript

- **Database** : PostgreSQL

- **ORM** : typeorm



##  ディレクトリ構造
```text
src/
├── main.ts          # エントリーポイント
├── app.module.ts    # ルートモジュール
├── app.datasource.ts    # TypeORM データソース設定（DB接続・マイグレーション設定）
├── [post]/         # 投稿関連モジュール (Controller, Service, Entity)
├── [auth]/          # 認証関連モジュール
├── [user]/          # ユーザ情報関連モジュール
├── entities/        # エンティティ定義 (*.entity.ts)
└── migrations/      # マイグレーションファイル



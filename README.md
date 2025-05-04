# 5ch風匿名掲示板

このプロジェクトは[Next.js](https://nextjs.org)を使用した5ch風匿名掲示板サイトです。会員登録不要で簡単に書き込みができる掲示板システムを実装しています。

## 技術スタック

- フロントエンド: Next.js (Pages Router) + TypeScript
- バックエンド: Supabase (PostgreSQL)
- スタイリング: Tailwind CSS + shadcn/ui + Radix
- アイコン: Lucide Icons
- アニメーション: Framer-motion
- デプロイ: Vercel + GitHub

## 始め方

まず、開発サーバーを起動します：

```bash
npm run dev
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開くと結果が表示されます。

## 機能

- 複数の掲示板（板）を持つことができます
- スレッド作成・返信機能
- 名前、メール(sage)、トリップコードの設定
- IPハッシュによるID表示
- パステルカラーを使用した掲示板らしいデザイン
- レスポンシブデザイン

## プロジェクト構成

```
/
├── public/              # 静的ファイル
├── src/
│   ├── components/      # UIコンポーネント
│   ├── lib/             # ユーティリティ関数
│   ├── pages/           # ページコンポーネント
│   └── styles/          # スタイル定義
├── supabase/            # Supabaseスキーマ定義
└── prisma/              # 旧SQLite用スキーマ(参照用)
```

## セットアップ手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd anon-board
```

2. 依存パッケージのインストール
```bash
npm install
```

3. 環境変数の設定
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 開発サーバー起動
```bash
npm run dev
```

## Vercelへのデプロイ

1. GitHubにリポジトリをプッシュ
2. Vercelでプロジェクトを作成し、GitHubリポジトリを連携
3. 環境変数を設定
4. デプロイ

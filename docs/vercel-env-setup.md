# Vercel 環境変数の設定方法

Vercelへのデプロイ時に必要な環境変数の設定方法を説明します。

## 1. Supabaseの設定情報を取得

1. [Supabase](https://supabase.com/) にログインし、プロジェクトを開きます
2. 左メニューから「Project Settings」をクリックします
3. 「API」タブを選択します
4. 以下の情報をコピーしておきます：
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon public (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 2. Vercelでの環境変数設定

1. Vercelでプロジェクトを作成/選択します
2. 「Settings」タブをクリックします
3. 左メニューから「Environment Variables」を選択します
4. 「Add New」ボタンをクリックして、以下の環境変数を追加します：

| 変数名 | 値 | 環境 |
|------|-----|------|
| NEXT_PUBLIC_SUPABASE_URL | (Supabaseから取得したURL) | Production, Preview, Development |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | (Supabaseから取得したキー) | Production, Preview, Development |

5. 「Save」ボタンをクリックして保存します

## 3. 再デプロイ

環境変数を設定した後、プロジェクトを再デプロイします：

1. 「Deployments」タブをクリックします
2. 最新のデプロイを選択します
3. 「Redeploy」ボタンをクリックします

これでVercelの環境変数が正しく設定され、Supabaseと連携したアプリケーションがデプロイされます。 
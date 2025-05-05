# Supabase セットアップガイド

このプロジェクトで使用するSupabaseのセットアップ方法を説明します。

## 1. アカウント作成

1. [Supabase](https://supabase.com/) にアクセスします
2. 「Start your project」をクリックします
3. GitHub、Google、またはメールアドレスでアカウントを作成/ログインします

## 2. プロジェクト作成

1. ダッシュボードから「New Project」をクリックします
2. 以下の情報を入力します：
   - Name: `anon-board`（任意の名前）
   - Database Password: 安全なパスワードを設定
   - Region: 最も近いリージョンを選択
3. 「Create new project」をクリックします
4. プロジェクトが作成されるまで待ちます（約1分）

## 3. データベーススキーマの設定

1. 左メニューから「SQL Editor」をクリックします
2. 「New Query」をクリックします
3. プロジェクトの `supabase/schema.sql` ファイルの内容をコピーしてエディタに貼り付けます
4. 「Run」ボタンをクリックして実行します

## 4. ストレージバケットの作成（画像アップロード用）

1. 左メニューから「Storage」をクリックします
2. 「Create new bucket」をクリックします
3. 以下の情報を入力します：
   - Name: `images`
   - Access Level: `public`（公開画像の場合）
4. 「Create bucket」をクリックします

## 5. バケットのアクセス権限設定

1. 作成したバケットを選択します
2. 「Policies」タブをクリックします
3. 「Add Policies」をクリックします
4. テンプレートから「Allow public access to all files in a specific bucket」を選択します
5. バケット名を確認して「Use this template」をクリックします
6. 「Review」をクリックし、「Create policy」で確定します

## 6. API認証情報の取得

1. 左メニューから「Project Settings」をクリックします
2. 「API」タブを選択します
3. 以下の情報をコピーして保存します：
   - Project URL: `NEXT_PUBLIC_SUPABASE_URL`
   - anon public: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

これらの認証情報はVercelでの環境変数設定に使用します。 
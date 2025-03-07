# 📅 Calendxr

**AIの力でカレンダーをシンプルに**

[![GitHub stars](https://img.shields.io/github/stars/nobu-h-o/Calendxr?style=social)](https://github.com/nobu-h-o/Calendxr/stargazers)
[![GitHub license](https://img.shields.io/github/license/nobu-h-o/Calendxr)](https://github.com/nobu-h-o/Calendxr/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13.x-black)](https://nextjs.org/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

[English](README.md) | 日本語

## 📋 目次
- [🚀 はじめに](#-はじめに)
  - [前提条件](#前提条件)
  - [インストール](#インストール)
  - [環境設定](#環境設定)
- [⚡ 機能](#-機能)
- [🔒 プライバシー重視のアプローチ](#-プライバシー重視のアプローチ)
- [🛠 使用技術](#-使用技術)
  - [技術スタック](#技術スタック)
  - [使用API](#使用api)
- [🧠 アーキテクチャ](#-アーキテクチャ)
- [🤝 貢献](#-貢献)
- [📜 ライセンス](#-ライセンス)
- [👨‍💻 開発チーム](#-開発チーム)
- [🙏 謝辞](#-謝辞)

## 🚀 はじめに

以下の手順で、開発およびテスト用にローカルマシンでプロジェクトをセットアップできます。本番環境へのデプロイについては、デプロイセクションを参照してください。

### 前提条件

開始する前に、以下のものがインストールされていることを確認してください：
- [Node.js](https://nodejs.org/) (v18.x以上)
- [npm](https://www.npmjs.com/) (v9.x以上)
- [Docker](https://www.docker.com/) (オプション、コンテナ化された開発用)
- [Git](https://git-scm.com/)
- [Poetry](https://python-poetry.org/) (Python依存関係管理用)
- [Python](https://www.python.org/) (v3.9以上)

また、以下も必要です：
- Calendar APIとVision APIが有効化されたGoogle Cloudアカウント
- 特定のAI機能用のOpenAI APIキー
- RAGチャットボット実装用のDify AIアカウント

### インストール

1. リポジトリをクローンします：
   ```bash
   git clone https://github.com/nobu-h-o/Calendxr.git
   cd Calendxr
   ```

2. 環境変数を設定します：
   
   フロントエンドとバックエンドのディレクトリには、それぞれ独自の環境設定があります：
    
   #### フロントエンド環境
   環境ファイルの例をコピーして、値を更新します：
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
    
   #### バックエンド環境
   環境ファイルの例をコピーして、値を更新します：
   ```bash
   cd backend
   cp .env.example .env
   ```
   必要なAPIキーと認証情報：
    - Google OAuth認証情報（クライアントIDとシークレット）
    - Google Cloud Vision APIキー
    - OpenAI APIキー
    - Dify APIキーとエンドポイント
    - NextAuth URLとシークレット
    
   アプリケーションが正しく機能するために、両方の環境ファイルに必要なすべての変数を入力してください。
3. 以下の開発方法のいずれかを選択します：

#### Dockerの使用（推奨）

Dockerを使用して完全なアプリケーションスタックを実行します：
```bash
docker compose up --build
```

#### フロントエンドとバックエンドを別々に実行

**フロントエンド：**
```bash
cd frontend
npm install
npm run dev
```

**バックエンド：**
```bash
cd backend
poetry update
poetry run uvicorn main:app --reload
```

4. ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認します。

## ⚡ 機能

CalendxrはAIを活用したスマートカレンダー体験を提供し、以下の主要機能があります：

- **画像入力：** 写真を使用してイベントを作成します。
  - イベントのチラシや招待状の写真を撮影
  - AIが日付、時間、場所などのイベント詳細を自動的に抽出

- **RAG搭載AIチャットボットアシスタント：**
  - 自然言語でスケジュールについて質問
  - カレンダーの整理に関するインテリジェントな提案
  - Difyの検索拡張生成（RAG）技術を活用

- **自動イベント提案：** 
  - AIが利用可能な日付から潜在的なイベントを検出
  - あなたのパターンに基づいたスケジュール設定のためのスマートな推奨

- **Googleカレンダーへの直接統合：**
  - Googleカレンダーとのシームレスな同期
  - イベントのデータベース保存なし - すべてはGoogleアカウント内に保持されます

## 🔒 プライバシー重視のアプローチ

Calendxrでは、プライバシーを重視しています：

- **データベース保存なし：** ユーザー情報やカレンダーイベントのデータベースを維持しません。すべてはGoogleアカウントと直接同期されます。

- **一時的な処理：** イベント作成のためにアップロードされた画像は処理後すぐに破棄されます。

- **最小限の権限：** アプリが機能するために必要な最小限のGoogleカレンダー権限のみを要求します。

- **透明なコードベース：** アプリケーション全体がオープンソースであり、プライバシーに関する主張とセキュリティ慣行を検証できます。

- **チャット履歴なし：** AIアシスタントとのチャットセッションは閉じると破棄され、やり取りの永続的な記録は残りません。

## 🛠 使用技術

### 技術スタック

- [Next.js](https://nextjs.org/) - フロントエンド構築のためのReactフレームワーク
- [FastAPI](https://fastapi.tiangolo.com/) - バックエンドAPIフレームワーク
- [Docker](https://www.docker.com/) - 一貫した開発とデプロイのためのコンテナ化
- [Vercel](https://vercel.com/) - フロントエンドホスティングプラットフォーム
- [AWS](https://aws.amazon.com/) - バックエンドサーバーインフラストラクチャ
- [TailwindCSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- [NextAuth.js](https://next-auth.js.org/) - Next.js用認証
- [React Query](https://react-query.tanstack.com/) - データフェッチングと状態管理
- [Poetry](https://python-poetry.org/) - バックエンド用Python依存関係管理

### 使用API

- [Google Calendar API](https://developers.google.com/calendar) - カレンダー統合とイベント管理用
- [Google Cloud Vision API](https://cloud.google.com/vision) - 画像分析とテキスト抽出用
- [OpenAI API](https://openai.com/api/) - 高度なAI処理と自然言語理解用
- [Dify AI API](https://dify.ai/) - AIチャットボット統合とRAG実装用

## 🧠 アーキテクチャ

Calendxrは現代的なWebアプリケーションアーキテクチャに従っています：

1. **フロントエンド (Next.js):**
   - 改善されたSEOとパフォーマンスのためのサーバーサイドレンダリング
   - インタラクティブなUI要素のためのクライアントサイドReactコンポーネント
   - Google OAuth認証のためのNextAuth.js

2. **バックエンドサービス:**
   - 特定の機能のためのFastAPIマイクロサービス
   - イベント処理のためのサーバーレス機能

3. **統合レイヤー:**
   - Google APIとの直接統合
   - サードパーティサービスへの安全なAPI呼び出し

4. **主要設計原則:**
   - デザインによるプライバシー - 不必要なデータ保存なし
   - すべてのデバイス向けのレスポンシブデザイン
   - アクセシビリティ準拠

## 🤝 貢献

コミュニティからの貢献を歓迎します！貢献するには：

1. リポジトリをフォークする
2. 機能ブランチを作成する：`git checkout -b feature/素晴らしい機能`
3. 変更をコミットする：`git commit -m '素晴らしい機能を追加'`
4. ブランチにプッシュする：`git push origin feature/素晴らしい機能`
5. プルリクエストを開く

行動規範とプルリクエスト提出プロセスの詳細については、[CONTRIBUTING.md](CONTRIBUTING.md)をお読みください。

## 📜 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 👨‍💻 開発チーム

<<<<<<< HEAD
- **Miu Nicole Takagi** - *プロジェクトマネージャー* - [GitHub](https://github.com/mint-talltree)
- **Nobuhiro Oto** - *フルスタック* - [GitHub](https://github.com/nobu-h-o)
- **Ryota Tetsuka** - *フロントエンド* - [GitHub](https://github.com/rogue1starwars)
- **Jihun Park** - *バックエンド* - [GitHub](https://github.com/JihunPark03)
- **Atomu Naka** - *バックエンド* - [GitHub](https://github.com/Cardioid22)
- **Misaki Hara** - *バックエンド＆インフラ* - [GitHub](https://github.com/gostachan)
=======
- **高木美羽ニコル** - *プロジェクトマネージャー* - [GitHub](https://github.com/mint-talltree)
- **太田信浩** - *フルスタック* - [GitHub](https://github.com/nobu-h-o)
- **手塚瞭太** - *フロントエンド* - [GitHub](https://github.com/rogue1starwars)
- **パク・ジフン** - *バックエンド* - [GitHub](https://github.com/JihunPark03)
- **中晃夢** - *バックエンド* - [GitHub](https://github.com/Cardioid22)
- **原美咲** - *バックエンド＆インフラ* - [GitHub](https://github.com/gostachan)
>>>>>>> 305988b (update readme)

## 🙏 謝辞

- ハッカソンチームの皆様の献身と創造性に特別な感謝を
- ハッカソン主催者、審査員、および他の参加者の皆様に大きな感謝を
- このプロジェクトで使用された素晴らしいツールとライブラリのオープンソースコミュニティに感謝
- 主要機能を提供するAPIを提供してくれたGoogle Cloudに感謝
- RAGチャットボット実装のサポートをしてくれたDify AIに感謝
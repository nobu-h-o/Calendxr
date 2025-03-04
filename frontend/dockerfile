# ベースイメージ
FROM node:18

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係のインストール
COPY package*.json ./

RUN rm -rf node_modules package-lock.json

RUN npm install && npm install next lucide-react

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションのビルド
RUN npm run build

# アプリケーションの起動
CMD ["npm", "run", "dev"]

# ポートの設定
EXPOSE 3000

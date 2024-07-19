# YouTube の動画をダウンロードできる web アプリを作成

## 概要

YouTube の動画をダウンロードできる web アプリを作成する

## 目的

友達からの依頼と、個人的な興味

## サーバー

サーバーは conoha の VPS を使用

[ConoHa VPS](https://www.conoha.jp/vps/)

ドメインは一時的に mcakh-studio.site を使用。ゆくゆくは yotube-downloader.(com | net | site)(仮) に変更

os は ubuntu 20.04 or 22.04 を使用

アップグレード可能なので、最初は 512MB のプランで作成し、必要に応じてアップグレードする(ubuntu 22.04 では 512MB のプランは使えないため開発は 20.04 で行う)

値段(1 ヶ月)
| 512MB | 1GB | 2GB | 4GB | 8GB |
| :------: | :------: | :-------: | :-------: | :-------: |
| 459 円/月 | 762 円/月 | 1258 円/月 | 2407 円/月 | 4827 円/月 |

-   Linux のコマンドを覚える
-   node.js のインストール方法を調べる

    [Linux の基本コマンド一覧](https://gihyo.jp/assets/pdf/book/2021/978-4-297-12024-5/LinuxCmdQuickReference.pdf)

    [Ubuntu 20.04 に Node.js をインストールする方法](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04-ja)

## 使用技術

-   node.js
    -   express
-   next.js
-   typescript

## 作成手順

node.js でサーバーを立ち上げ、express で ダウンロード API を作成する。

next.js でフロントエンドを作成する。

next.js で作成したフロントエンドから、express で作成した API を叩く。

## 作成手順詳細

1. node.js でサーバーを立ち上げる
2. express でダウンロード API を作成する
3. next.js でフロントエンドを作成する
4. next.js で作成したフロントエンドから、express で作成した API を叩く
5. 動画をダウンロードする(リンクからダウンロードする形式)

## ファイル形式

-   .mp4 (動画)
-   .mp3 (音声)

2 つのリンクボタンを作成し、それぞれのリンクを押すと、動画、音声がダウンロードされるようにする。

## 問題

-   mp3 に変換する際に ffmpeg を使う必要がある可能性がある(ffmpeg を使う方法を調べる)
-   ダウンロードする際に、動画、音声のファイル名を指定する必要がある(動画の ID をそのままファイル名にする)

## 参考資料

[express Doc](https://expressjs.com/ja/4x/api.html)

[Express.js 完全入門](https://qiita.com/ryome/items/16659012ed8aa0aa1fac)

[Next.js Doc](https://nextjs.org/docs)

[node-ytdl-core(GitHub)](https://github.com/fent/node-ytdl-core)

[【Nodejs】Express+ytdl で youtube の動画をダウンロードするアプリを作る](https://tkstock.site/2020/06/20/nodejs-express-ytdl-youtube-%E5%8B%95%E7%94%BB-%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89/)

[JavaScript 初心者が Node.js で youtube の動画を mp3 保存するプログラム書いたよという話。](https://blog.goo.ne.jp/yaratto/e/66522abc52019680fcbdc5844fe823c2)

### これを参考に next.js だけで完結できるかも

[Next.js を変な使い方してみた](https://qiita.com/ShinYoshiaki/items/25c3ea6c6eef4e7e8e7f)

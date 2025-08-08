const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

// Webhookエンドポイントを定義
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent)) // 各イベントを処理
    .then((result) => res.json(result)); // 結果を返す
});

// LINEクライアントを作成
const client = new line.Client(config);

// イベントハンドラー
function handleEvent(event) {
  // メッセージタイプが「テキスト」以外、またはメッセージが画像でない場合は処理しない
  if (event.type !== 'message') {
    return Promise.resolve(null);
  }

  // 画像メッセージが送信された場合の処理
  if (event.message.type === 'image') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '画像を受け取ったよ！',
    });
  }

  // スタンプメッセージが送信された場合の処理
  if (event.message.type === 'sticker') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'スタンプありがとう！めっちゃいい感じだね！',
    });
  }

  // 絵文字メッセージが送信された場合の処理
  if (event.message.type === 'emoji') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '絵文字！いいセンスだね！',
    });
  }

  // テキストメッセージが送信された場合の処理
  if (event.message.type === 'text') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `「${event.message.text}」って言ったね！`,
    });
  }

  return Promise.resolve(null); // 上記以外のメッセージタイプは無視
}


// サーバーをポート3000で起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`LINE Bot running on port ${port}`);
});

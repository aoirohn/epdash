# Dashboard

電子ペーパーに表示するダッシュボードを提供するWebサーバーです。

## ページ

### `/`

ここから以下のページにアクセスできます。

### `/dashboard`

ダッシュボードのメインページにアクセスします。デバッグ用途に利用します

### `/image.png`

ダッシュボードのスクリーンショット画像を取得します。デバッグ用

### `/dithered-image.png`

ダッシュボードのスクリーンショット画像をディザリング処理した画像を取得します。Waveshare 7.3inch e-Paper HAT (F)に合わせて減色した画像が表示されます

## 環境設定

以下の通り`.env`ファイルを作成してください。

```properties
CALENDAR_ID="your_calendar_id@gmail.com"

OPEN_WEATHER_MAP_API_KEY="your_open_weather_map_api_key"
OPEN_WEATHER_MAP_LOCATION_NAME="your_location_name"

SERVER_PORT=your_server_port
```

## インストール

```sh
bun install
```

初回はplaywrightの依存パッケージのインストールが必要です

```sh
bunx playwright install
```

## PM2を使用したサーバーの起動

`pm2`を使用してサーバーを立ち上げるには、以下の手順に従ってください。

1. サーバーをビルドします。

```sh
bun run build
```

1. サーバーを`pm2`で起動します。

```sh
bun run pm2-start
```

1. サーバーを停止する場合は、以下のコマンドを実行します。

```sh
bun run pm2-stop
```

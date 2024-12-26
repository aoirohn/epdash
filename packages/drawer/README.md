# Drawer

[dashboard](../dashboard/)で公開した画像をダウンロードし、電子ペーパーに書き込むPythonスクリプトです。

## 必要条件

- Python 3.13
- [uv](https://github.com/astral-sh/uv)

## インストール

1. 必要なパッケージをインストールします。

```sh
uv sync
```

## 環境設定

1. `.env` ファイルを作成し、以下の内容を記載します。

```env
DASHBOARD_URL="http://<your-dashboard-url>:<port>/dithered-image.png"
```

## 使用方法

画像をダウンロードして電子ペーパーに表示するには、以下のコマンドを実行します。

```sh
uv run draw-dashboard.py
```

電子ペーパーをクリアするには、以下のコマンドを実行します。

```sh
uv run clear.py
```

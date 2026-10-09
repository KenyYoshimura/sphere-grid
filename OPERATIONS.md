# 運用手順（スフィア盤）

## 仕組み
- **公開版**（GitHub Pages）は閲覧専用。盤面データは暗号化された `data.enc` だけを配信し、URL の `#k=鍵` で復号して表示する。`#` 以降はサーバーに送られない。
- **編集**はローカルだけ。`data.json`（平文）と `.sphere-key`（鍵）は手元にのみ存在し、`.gitignore` で除外している。
- 公開側を更新できるのは、このリポジトリへの書き込み権限を持つ人だけ。

## 編集して公開する
```bash
node tools/serve.mjs          # http://localhost:8765/ を開く → 編集モード → 保存
git save "スフィア盤を更新"     # data.enc をコミット＆プッシュ（main に入ると Pages が更新）
```
保存すると `data.json` の更新と `data.enc` の再暗号化が同時に行われる。

## Notion に貼る閲覧URLを確認・再発行する
```bash
node tools/encrypt.mjs            # 現在の閲覧URLを表示
node tools/encrypt.mjs --rotate   # 鍵を作り直す（旧URLは無効。Notion のリンクを貼り替える）
```
閲覧URLは社外に出さない。漏れた場合は `--rotate` で無効化できる。

## 動作確認
`http://localhost:8765/?view#k=<鍵>` で、公開版と同じ閲覧専用の表示を手元で確認できる。

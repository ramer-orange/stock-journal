# UI リデザイン実装まとめ

## src/app/globals.css
- Tailwind v4 の `@theme inline` を使ってダーク基調のカラートークンを定義し、アプリ全体の配色ポリシーを更新。
- `:root` と `body` にダークモード背景・タイポグラフィ設定を適用し、共通のフォントファミリーとフォーカススタイルを統一。
- 選択範囲やフォーム要素のフォーカスアウトラインなど、共通UIに必要なベーススタイルを追加。

## src/lib/utils.ts
- クラス名結合ユーティリティ `cn` を追加し、UIコンポーネントで条件付きクラスを扱いやすくした。

## src/components/ui/Card.tsx
- カードレイアウト用の共通コンポーネント（`Card`, `CardHeader`, `CardTitle` など）を実装し、各画面で再利用できるラップ要素を提供。

## src/components/ui/Button.tsx
- ボタンのバリアント（primary / secondary / danger / ghost / plain）とサイズ（sm / md / lg）を定義し、再利用可能なボタンスタイルを整備。

## src/components/ui/Input.tsx
- `size` プロップで `sm` と `md` を切り替えられるよう拡張し、コンパクトなフォームフィールドを提供。
- エラーステートやフォーカスリングを共通化。

## src/components/ui/Select.tsx
- `size` プロップ対応のセレクトコンポーネントを実装。
- カスタムドロップダウンアイコンやエラーステートを共通化し、ダークテーマに合わせたデザインを付与。

## src/components/ui/Textarea.tsx
- `size` プロップで `sm` / `md` を切り替えられるテキストエリアを作成し、用途に応じた高さや文字サイズを制御可能にした。

## src/components/ui/Badge.tsx
- ステータス表示用のバッジ（neutral / success / danger）を実装し、記録の状態表示に利用。

## src/components/ui/ErrorMessage.tsx
- フォームエラーを共通フォーマットで表示するコンポーネントを追加し、アクセシビリティ対応（`role="alert"` 等）を実装。

## src/app/(main)/journals/page.tsx
- ページヘッダーの文言を「取引記録」に統一し、導入文を更新。レイアウトを `max-w-7xl` のコンテナに合わせて整えた。

## src/app/(main)/journals/_components/journalLists/JournalList.tsx
- ビジネスロジックを変更せず、共通UIコンポーネントへ置き換えてダークテーマのレイアウトに刷新。
- 入力フィールドやセレクトを `size="sm"` で揃え、1カードあたりの情報をコンパクトに表示。
- 売買記録リストや空状態メッセージのデザインを調整し、右下固定の追加ボタン（白枠＋黒十字）を導入。
- 余計なヘッダーを削除し、レスポンシブ志向のスペーシングやラベル配置へ変更。

## src/app/(main)/journals/_components/trades/TradeForm.tsx
- 共通UIコンポーネントへ置き換えながら、フォームの余白・文字サイズを縮小してコンパクト化。
- 売買理由とメモをデスクトップでは横並び、モバイルでは縦並びにするレスポンシブグリッドを導入。
- エラー表示を `ErrorMessage` コンポーネントに統一し、全体の視覚階層を再設計。


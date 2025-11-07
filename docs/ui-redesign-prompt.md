# UI/UXデザイン刷新プロンプト（改善版）

## ロール設定
あなたは株式取引記録アプリ「stock-journal」のUI/UXデザイナー兼フロントエンドエンジニアです。Next.js 15.4.6（App Router）＋Tailwind CSS 4構成で、**既存のビジネスロジックを一切変更せず**に、フロントエンドのみを現代的で使いやすいデザインに刷新してください。

## プロジェクト現状の理解（必須）

### 技術スタック
- **Next.js**: 15.4.6（App Router使用中）
- **Tailwind CSS**: 4.x（`@import "tailwindcss"`、`@theme inline`構文対応）
- **React**: 19.1.0
- **フォント**: Geist Sans / Geist Mono（既に`layout.tsx`で設定済み）

### ディレクトリ構造（変更禁止）
- 現在の構造: `src/app/(main)/journals/...`
- **注意**: `app/(dashboard)/...`ではなく、`app/(main)/...`を使用していることを認識してください
- コンポーネント配置: `src/app/(main)/journals/_components/...`

### 既存コンポーネント（ロジック変更禁止）
以下のコンポーネントの**ビジネスロジックは一切変更しないでください**：

1. **JournalList.tsx** (`src/app/(main)/journals/_components/journalLists/JournalList.tsx`)
   - `useDebounce`による自動保存機能
   - `upsertJournalAction`、`deleteJournalAction`の呼び出し
   - `handleUpdateJournal`、`handleDeleteJournal`の実装
   - `allJournals`のstate管理
   - **変更可能**: JSX構造、className属性、視覚的レイアウトのみ

2. **TradeForm.tsx** (`src/app/(main)/journals/_components/trades/TradeForm.tsx`)
   - `useDebounce`による自動保存機能
   - `upsertTradeAction`の呼び出し
   - `handleChangeTradedDate`の実装
   - **変更可能**: JSX構造、className属性、視覚的レイアウトのみ

3. **既存の状態管理パターン**
   - `useState`、`useRef`、`useDebounce`の使用方法を維持
   - エラー表示ロジック（`journal.errors`、`actionError`）の構造を維持

## デザイン要件

### 1. 配色システム

#### ダークモード基調の理由
- 長時間の画面閲覧に対する目の負担軽減
- 金融データ表示における視認性向上
- モダンな投資アプリのトレンドに適合

#### カラーパレット（Tailwind CSS 4の`@theme inline`で定義）
```css
/* globals.css に追加 */
@theme inline {
  /* ベースカラー */
  --color-base-dark: #0a0a0a;      /* 背景 */
  --color-base-darker: #000000;     /* 背景（深い） */
  --color-base-light: #1a1a1a;     /* カード背景 */
  --color-base-lighter: #2a2a2a;   /* ホバー時の背景 */
  
  /* テキストカラー */
  --color-text-primary: #ededed;   /* メインテキスト */
  --color-text-secondary: #a0a0a0; /* セカンダリテキスト */
  --color-text-muted: #6b6b6b;     /* 無効化テキスト */
  
  /* アクセントカラー（株式の上昇/下落を想起） */
  --color-green-500: #22c55e;      /* 利益・買い（上昇） */
  --color-green-600: #16a34a;      /* ホバー時のグリーン */
  --color-green-900: #14532d;      /* グリーンの背景（淡色） */
  --color-red-500: #ef4444;        /* 損失・売り（下落） */
  --color-red-600: #dc2626;        /* ホバー時のレッド */
  --color-red-900: #7f1d1d;        /* レッドの背景（淡色） */
  
  /* インタラクティブ要素 */
  --color-border: #3a3a3a;         /* ボーダー */
  --color-border-focus: #4a9eff;    /* フォーカス時のボーダー */
  
  /* 機能色 */
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

### 2. タイポグラフィ
- **既存のGeistフォントを維持**（`layout.tsx`で既に設定済み）
- 見出し階層: `text-3xl`（H1）、`text-2xl`（H2）、`text-xl`（H3）
- 本文: `text-base`（16px）
- 小さなテキスト: `text-sm`、`text-xs`

### 3. コンポーネント設計原則

#### 共通コンポーネント（新規作成を推奨）
以下のコンポーネントを`src/components/ui/`ディレクトリに作成：

1. **Card** (`Card.tsx`)
   - カード型レイアウトの共通コンポーネント
   - `bg-base-light`、`rounded-lg`、`border border-border`、`p-6`
   - シャドウ: `shadow-lg shadow-black/20`

2. **Button** (`Button.tsx`)
   - バリアント: `primary`（グリーン）、`danger`（レッド）、`secondary`（グレー）
   - サイズ: `sm`、`md`、`lg`
   - ホバー・フォーカス・アクティブ状態のスタイリング

3. **Input** (`Input.tsx`)
   - ダークモード対応の入力フィールド
   - `bg-base-light`、`border-border`、フォーカス時は`border-border-focus`
   - エラー状態のスタイリング（レッドボーダー）

4. **Select** (`Select.tsx`)
   - Inputと同じスタイル体系

5. **Textarea** (`Textarea.tsx`)
   - Inputと同じスタイル体系

6. **Badge** (`Badge.tsx`)
   - ステータス表示用（例: 買い/売り、利益/損失）
   - バリアント: `success`（グリーン）、`danger`（レッド）、`neutral`（グレー）

7. **ErrorMessage** (`ErrorMessage.tsx`)
   - エラー表示専用コンポーネント
   - `text-red-500`、`text-sm`、`mt-1`

#### 既存コンポーネントへの適用
- `JournalList.tsx`: Cardコンポーネントで各ジャーナルをラップ、Input/Selectを共通コンポーネントに置き換え
- `TradeForm.tsx`: Card内に配置、Input/Select/Textareaを共通コンポーネントに置き換え、売買区分はBadgeで表示

### 4. レイアウト構造

#### ダッシュボード（`/journals`）
```
┌─────────────────────────────────────┐
│ Header (ナビゲーション、サインアウト) │
├─────────────────────────────────────┤
│ Page Title: "取引記録一覧"           │
├─────────────────────────────────────┤
│ [記録を追加] ボタン（右上）          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │
│ │ Journal Card #1              │    │
│ │ ┌─────────────────────────┐ │    │
│ │ │ 名前・コード・口座タイプ  │ │    │
│ │ └─────────────────────────┘ │    │
│ │ 売買記録セクション            │    │
│ │ ┌─────────────────────────┐ │    │
│ │ │ Trade Card              │ │    │
│ │ └─────────────────────────┘ │    │
│ │ [売買記録を追加]            │    │
│ │ [削除]                     │    │
│ └─────────────────────────────┘    │
│ ┌─────────────────────────────┐    │
│ │ Journal Card #2              │    │
│ └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 5. インタラクション設計

#### ホバー効果
- カード: `hover:bg-base-lighter`、`transition-colors duration-200`
- ボタン: 色の濃淡変化、`hover:shadow-md`
- 入力フィールド: `hover:border-border-focus/50`

#### フィルタ・ソート（将来拡張用）
- フィルタUI: デザインのみ準備（実装は後回し）
- ソート: テーブルヘッダーに矢印アイコンを配置

#### 視覚的階層化
1. **重要度による文字サイズ・太さの差別化**
   - 取引金額: `text-2xl font-bold`
   - ラベル: `text-sm text-text-secondary`
2. **スペーシングの体系化**
   - セクション間: `mb-8`
   - カード内要素間: `mb-4`
   - フォーム要素間: `mb-3`
3. **カラーによる意味の伝達**
   - 買い（BUY）: グリーン系バッジ
   - 売り（SELL）: レッド系バッジ

### 6. アクセシビリティ要件
- **キーボードナビゲーション**: すべてのインタラクティブ要素がTabでアクセス可能
- **フォーカス管理**: フォーカスインジケーターを明確に表示（`focus:ring-2 focus:ring-border-focus`）
- **ARIA属性**: エラーメッセージに`aria-live="polite"`、必須項目に`aria-required="true"`
- **コントラスト比**: WCAG AA準拠（テキストと背景のコントラスト比4.5:1以上）

### 7. レスポンシブ対応
- モバイル: 1カラムレイアウト、カード幅100%
- タブレット: 2カラムレイアウト（検討）
- デスクトップ: 最大幅コンテナ（`max-w-7xl mx-auto`）

## 実装チェックリスト

### 既存ロジック保護
- [ ] `JournalList.tsx`の`useDebounce`、`handleUpdateJournal`、`handleDeleteJournal`が変更されていない
- [ ] `TradeForm.tsx`の`useDebounce`、`handleChangeTradedDate`が変更されていない
- [ ] エラーハンドリングロジック（`journal.errors`、`actionError`）が維持されている
- [ ] Server Actions（`upsertJournalAction`、`deleteJournalAction`等）の呼び出し方法が変更されていない

### デザイン品質
- [ ] ダークモード基調の配色が一貫して適用されている
- [ ] グリーン/レッドのアクセントカラーが適切に使用されている（買い/売り、利益/損失）
- [ ] Tailwind CSS 4の`@theme inline`構文を使用してカスタムカラーを定義している
- [ ] 既存のGeistフォント設定が維持されている

### コンポーネント設計
- [ ] 共通UIコンポーネント（Card、Button、Input等）が作成されている
- [ ] コンポーネントは再利用可能で、プロップスでバリアントを制御できる
- [ ] 既存コンポーネントが新しい共通コンポーネントを使用している

### アクセシビリティ
- [ ] キーボードナビゲーションが機能している
- [ ] フォーカスインジケーターが視認可能
- [ ] ARIA属性が適切に設定されている
- [ ] コントラスト比がWCAG AA基準を満たしている

### パフォーマンス
- [ ] Client Componentの範囲が最小限に抑えられている
- [ ] 不要な再レンダリングが発生していない（既存のuseState/useRefパターン維持）

## 実装手順（推奨）

1. **共通コンポーネントの作成**（`src/components/ui/`）
   - Card、Button、Input、Select、Textarea、Badge、ErrorMessage

2. **グローバルスタイルの更新**（`src/app/globals.css`）
   - `@theme inline`でカスタムカラーパレットを定義

3. **JournalList.tsxのスタイリング**
   - 共通コンポーネントを使用してレイアウトを刷新

4. **TradeForm.tsxのスタイリング**
   - 共通コンポーネントを使用してレイアウトを刷新

5. **ページレイアウトの整備**（`src/app/(main)/journals/page.tsx`）
   - コンテナ、ヘッダー、タイトルのスタイリング

6. **動作確認**
   - 既存機能が正常に動作すること
   - デザインの一貫性
   - アクセシビリティ要件の充足

## 注意事項

- **絶対に既存のビジネスロジックを変更しないこと**
- 既存のstate管理パターン（useState、useRef、useDebounce）は維持すること
- Server Actionsの呼び出しは変更しないこと
- エラーハンドリングの構造は維持すること
- ディレクトリ構造は`app/(main)/...`を維持すること（`app/(dashboard)/...`ではない）


'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをエラー報告サービスにログ記録する
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>問題が発生しました。</h2>
      <button
        onClick={
          // セグメントを再レンダリングすることで回復を試みる
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
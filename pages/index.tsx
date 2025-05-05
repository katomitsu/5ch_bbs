// pages/index.tsx 
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type Thread = {
  id: string
  title: string
  created_at: string
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([])

  useEffect(() => {
    const fetchThreads = async () => {
      const { data, error } = await supabase
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('スレッド取得エラー:', error)
      } else {
        setThreads(data)
      }
    }

    fetchThreads()
  }, [])

  return (
    <main className="min-h-screen px-4 py-8 bg-white text-gray-800">
      <h1 className="text-3xl font-bold mb-6">5ch風 匿名掲示板</h1>
      <p className="mb-4">ようこそ。ここから開発を始めましょう！</p>

      <h2 className="text-xl font-semibold mb-2">📋 スレッド一覧</h2>

      {/* 🧵 投稿ボタンのリンクを追加！ */}
      <Link href="/new-thread">
        <a className="text-blue-600 hover:underline mb-4 block">+ スレッドを立てる</a>
      </Link>

      <ul className="space-y-2">
        {threads.map((thread) => (
          <li key={thread.id} className="p-3 bg-gray-100 rounded shadow">
            🧵 {thread.title}
          </li>
        ))}
      </ul>
    </main>
  )
}

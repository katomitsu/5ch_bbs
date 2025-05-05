// pages/new-thread.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function NewThread() {
  const [title, setTitle] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('threads').insert([
      {
        title: title,
        author_name: '名無し',
      },
    ])

    if (error) {
      alert('スレッドの作成に失敗しました🥲')
      console.error(error)
    } else {
      alert('スレッドを作成しました！🎉')
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">📝 新しいスレッドを作る</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="スレッドタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          作成する
        </button>
      </form>
    </main>
  )
}

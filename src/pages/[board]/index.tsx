import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import prisma from '@/lib/prisma';

type Thread = {
  id: number;
  title: string;
  closed: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
  };
};

type BoardPageProps = {
  board: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  threads: Thread[];
};

export default function BoardPage({ board, threads }: BoardPageProps) {
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!board) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">板が見つかりません</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          トップページに戻る
        </Link>
      </div>
    );
  }

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError('タイトルと本文は必須です');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId: board.id,
          title,
          name: name || '名無しさん',
          email,
          body,
          ipAddress: '127.0.0.1', // 実際の実装ではサーバー側で取得
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'スレッド作成に失敗しました');
      }

      // 成功したらフォームをリセット
      setTitle('');
      setName('');
      setEmail('');
      setBody('');
      setIsCreatingThread(false);

      // ページをリロード
      window.location.reload();
    } catch (err) {
      console.error('Thread creation error:', err);
      setError(err instanceof Error ? err.message : 'スレッド作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{board.name} - 匿名掲示板</title>
        <meta name="description" content={`${board.name} - 匿名掲示板`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← トップページに戻る
          </Link>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 card-title-content">{board.name}</h1>
            {board.description && (
              <p className="text-gray-600 card-title-content">{board.description}</p>
            )}
          </div>
          <button 
            onClick={() => setIsCreatingThread(!isCreatingThread)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isCreatingThread ? 'キャンセル' : '新規スレッド作成'}
          </button>
        </div>

        {isCreatingThread && (
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">新規スレッド作成</h2>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="スレッドタイトル（必須）"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="名前（省略可）"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="メール（省略可）"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>

              <textarea
                placeholder="本文（必須）"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border rounded-md"
                required
              />

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? '作成中...' : 'スレッドを作成'}
                </button>
              </div>
            </form>
          </div>
        )}

        {threads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">スレッドがまだ作成されていません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {threads.map((thread) => (
              <Link 
                key={thread.id}
                href={`/${board.name}/thread/${thread.id}`}
                className={`block p-4 border rounded-lg hover:bg-gray-50 transition-colors ${thread.closed ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-offset">{thread.title}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-1">レス:</span>
                    <span>{thread._count.posts}</span>
                  </div>
                </div>
                
                {thread.closed && (
                  <span className="text-xs text-red-500 font-medium text-offset">
                    （クローズ済み）
                  </span>
                )}
                
                <div className="mt-2 text-xs text-gray-500 text-offset">
                  最終更新: {new Date(thread.updatedAt).toLocaleString('ja-JP')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { board: boardName } = context.params || {};

  if (!boardName || typeof boardName !== 'string') {
    return {
      notFound: true,
    };
  }

  // 板情報を取得
  const board = await prisma.board.findUnique({
    where: { name: boardName },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  if (!board) {
    return {
      props: {
        board: null,
        threads: [],
      },
    };
  }

  // スレッド一覧を取得
  const threads = await prisma.thread.findMany({
    where: { boardId: board.id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // 日付型をJSON化するために変換
  return {
    props: {
      board,
      threads: JSON.parse(JSON.stringify(threads)),
    },
  };
}; 
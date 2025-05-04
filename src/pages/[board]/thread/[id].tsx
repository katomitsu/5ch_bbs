import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import prisma from '@/lib/prisma';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Post = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
  ipHash: string;
  tripcode: string | null;
  email: string | null;
  imageUrl: string | null;
};

type ThreadDetailProps = {
  thread: {
    id: number;
    title: string;
    closed: boolean;
    createdAt: string;
    board: {
      id: number;
      name: string;
    };
  } | null;
  posts: Post[];
};

export default function ThreadDetail({ thread, posts: initialPosts }: ThreadDetailProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // スレッドが見つからない場合
  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-8 text-center glass-effect">
        <h1 className="text-2xl font-bold mb-4">スレッドが見つかりません</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          トップページに戻る
        </Link>
      </div>
    );
  }

  // 定期的に投稿を取得する関数
  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?threadId=${thread.id}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('投稿の取得に失敗しました');
    }
  };

  // ポーリングの開始/停止
  useEffect(() => {
    if (isPolling) {
      const interval = setInterval(fetchPosts, 30000); // 30秒ごとに更新
      return () => clearInterval(interval);
    }
  }, [isPolling, thread.id]);

  return (
    <>
      <Head>
        <title>{thread.title} - 匿名掲示板</title>
        <meta name="description" content={`${thread.title} - 匿名掲示板`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ background: '#f0f8ff', minHeight: '100vh', padding: '20px' }}>
        <main className="container mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="mb-6">
            <Link 
              href={`/${thread.board.name}`} 
              className="button-shadcn button-primary-shadcn px-3 py-1 text-sm inline-flex items-center space-x-1"
            >
              <span>←</span>
              <span>{thread.board.name}板に戻る</span>
            </Link>
          </div>

          <Card className="card-shadcn mb-6">
            <CardHeader className="bg-gradient-to-r from-primary/60 to-secondary/60 pb-3">
              <CardTitle className="text-2xl font-bold card-title-content">{thread.title}</CardTitle>
              <div className="flex justify-between text-sm mt-2">
                <div className="card-title-content">
                  作成日: {new Date(thread.createdAt).toLocaleString('ja-JP')}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setIsPolling(!isPolling)}
                    className={`px-2 py-1 rounded text-xs h-auto ${
                      isPolling ? 'bg-green-500 text-white' : 'bg-white/70'
                    }`}
                  >
                    {isPolling ? '自動更新中' : '自動更新'}
                  </Button>
                  <Button 
                    onClick={fetchPosts}
                    className="px-2 py-1 rounded bg-white/70 text-xs hover:bg-white/90 h-auto"
                  >
                    更新
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="card-shadcn mb-8">
            <CardContent className="p-0">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">投稿がまだありません</p>
                </div>
              ) : (
                <div>
                  {posts.map((post, index) => (
                    <PostItem
                      key={post.id}
                      number={post.id}
                      name={post.name}
                      email={post.email}
                      trip={post.tripcode}
                      ipHash={post.ipHash}
                      createdAt={post.createdAt}
                      body={post.body}
                      imageUrl={post.imageUrl}
                      isOp={index === 0}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {!thread.closed && (
            <Card className="card-shadcn mb-6">
              <CardContent className="p-0">
                <PostForm 
                  threadId={thread.id} 
                  onPostSuccess={fetchPosts}
                />
              </CardContent>
            </Card>
          )}

          {thread.closed && (
            <div className="text-center p-4 border rounded-lg bg-red-50 text-red-500">
              このスレッドはクローズされています。新しい投稿はできません。
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg">
              {error}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { board: boardName, id: threadId } = context.params || {};

  if (!boardName || !threadId || typeof boardName !== 'string' || typeof threadId !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    // スレッド情報を取得
    const thread = await prisma.thread.findFirst({
      where: {
        id: parseInt(threadId, 10),
        board: {
          name: boardName,
        },
      },
      include: {
        board: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!thread) {
      return {
        props: {
          thread: null,
          posts: [],
        },
      };
    }

    // 投稿を取得
    const posts = await prisma.post.findMany({
      where: {
        threadId: thread.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 日付型をJSON化するために変換
    const serializedThread = JSON.parse(JSON.stringify(thread));
    const serializedPosts = JSON.parse(JSON.stringify(posts));

    return {
      props: {
        thread: serializedThread,
        posts: serializedPosts,
      },
    };
  } catch (error) {
    console.error('Error fetching thread data:', error);
    return {
      notFound: true,
    };
  }
}; 
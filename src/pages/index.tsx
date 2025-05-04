import { GetServerSideProps } from 'next';
import Head from 'next/head';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Board = {
  id: number;
  name: string;
  description: string | null;
  _count: {
    threads: number;
  };
  threads?: {
    createdAt: string;
  }[];
};

type HomeProps = {
  boards: Board[];
};

export default function Home({ boards }: HomeProps) {
  return (
    <>
      <Head>
        <title>匿名掲示板</title>
        <meta name="description" content="匿名掲示板サイト" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div style={{ background: '#f0f8ff', minHeight: '100vh', padding: '20px' }}>
        <main className="container mx-auto" style={{ maxWidth: '1200px' }}>
          <Card className="card-shadcn mb-6">
            <CardHeader className="board-header">
              <CardTitle className="text-2xl font-bold">匿名掲示板</CardTitle>
              <CardDescription className="text-gray-700">登録不要で簡単に書き込めます</CardDescription>
            </CardHeader>
          </Card>
          
          {boards.length === 0 ? (
            <Card className="card-shadcn">
              <CardContent className="text-center py-12">
                <p className="text-gray-500">板がまだ作成されていません</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
                <Link 
                  href={`/${board.name}`}
                  key={board.id}
                  className="block"
                >
                  <Card className="card-shadcn h-full hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-primary/40 to-secondary/40 pb-3">
                      <CardTitle className="text-lg card-title-content">{board.name}</CardTitle>
                      {board.description && (
                        <CardDescription className="text-gray-700 card-title-content">
                          {board.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4 card-content-shadcn">
                      <div className="flex items-center space-x-2">
                        <span className="thread-count">
                          スレッド数: {board._count.threads}
                        </span>
                      </div>
                    </CardContent>
                    {board.threads && board.threads[0]?.createdAt && (
                      <CardFooter className="pt-0 text-xs text-gray-500 card-footer-shadcn">
                        最終更新: {new Date(board.threads[0].createdAt).toLocaleString('ja-JP')}
                      </CardFooter>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <footer className="footer">
            <p>© 2023 匿名掲示板 - 全ての権利を放棄</p>
          </footer>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // 板一覧を取得
  const boards = await prisma.board.findMany({
    include: {
      _count: {
        select: { threads: true }
      },
      threads: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
  
  // 日付型をJSON化するために変換
  const serializedBoards = JSON.parse(JSON.stringify(boards));
  
  return {
    props: {
      boards: serializedBoards,
    },
  };
}; 
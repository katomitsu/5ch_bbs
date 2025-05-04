import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { boardId } = req.query;
      
      if (!boardId || Array.isArray(boardId)) {
        return res.status(400).json({ error: '有効な板IDを指定してください' });
      }
      
      const threads = await prisma.thread.findMany({
        where: { 
          boardId: Number(boardId)
        },
        include: {
          _count: {
            select: { posts: true }
          },
          posts: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      
      return res.status(200).json(threads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      return res.status(500).json({ error: 'スレッドの取得に失敗しました' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { boardId, title, name, email, body, ipAddress } = req.body;
      
      // 入力検証
      if (!boardId || !title || !body) {
        return res.status(400).json({ error: '板ID、タイトル、本文は必須です' });
      }
      
      // IPハッシュの生成（実際の実装ではより安全な方法を使用）
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const ipHash = `${date}_${Buffer.from(ipAddress || 'unknown').toString('base64').substring(0, 8)}`;
      
      // トランザクションでスレッドと最初の投稿を作成
      const thread = await prisma.$transaction(async (tx) => {
        const newThread = await tx.thread.create({
          data: {
            title,
            boardId: Number(boardId),
          }
        });
        
        await tx.post.create({
          data: {
            threadId: newThread.id,
            name: name || '名無しさん',
            email: email || null,
            body,
            ipHash,
          }
        });
        
        return newThread;
      });
      
      return res.status(201).json(thread);
    } catch (error) {
      console.error('Error creating thread:', error);
      return res.status(500).json({ error: 'スレッドの作成に失敗しました' });
    }
  }

  // その他のメソッドは許可しない
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 
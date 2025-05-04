import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const boards = await prisma.board.findMany({
        include: {
          _count: {
            select: { threads: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return res.status(200).json(boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      return res.status(500).json({ error: '板の取得に失敗しました' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, description } = req.body;
      
      // 入力検証
      if (!name) {
        return res.status(400).json({ error: '板名は必須です' });
      }
      
      const board = await prisma.board.create({
        data: {
          name,
          description: description || null
        }
      });
      
      return res.status(201).json(board);
    } catch (error) {
      console.error('Error creating board:', error);
      return res.status(500).json({ error: '板の作成に失敗しました' });
    }
  }

  // その他のメソッドは許可しない
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
} 
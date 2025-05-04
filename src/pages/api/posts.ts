import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { parseFormWithFile } from '@/lib/fileUpload';

// body-parserを無効化（formidableが処理するため）
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // FormDataを解析（画像アップロード対応）
      const { fields, file } = await parseFormWithFile(req);
      
      // フィールドから必要な情報を取得
      const threadId = parseInt(fields.threadId?.[0] || '0', 10);
      const name = fields.name?.[0] || '名無しさん';
      const email = fields.email?.[0] || '';
      const body = fields.body?.[0] || '';
      const ipAddress = fields.ipAddress?.[0] || req.socket.remoteAddress || '127.0.0.1';
      
      // スレッドの存在チェック
      const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        include: {
          posts: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      if (!thread) {
        return res.status(404).json({ error: 'スレッドが見つかりません' });
      }

      if (thread.closed) {
        return res.status(403).json({ error: 'このスレッドは締め切られています' });
      }
      
      // 本文がなく画像もない場合はエラー
      if (!body.trim() && !file) {
        return res.status(400).json({ error: '本文または画像は必須です' });
      }

      // ID生成用の日付（YYYYMMDD形式）
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      
      // トリップコードの処理
      let displayName = name;
      let tripcode = null;
      
      if (name.includes('#')) {
        const [nameWithoutTrip, tripPassword] = name.split('#', 2);
        displayName = nameWithoutTrip || '名無しさん';
        
        if (tripPassword) {
          // 簡易的なトリップコード生成（実際の2chではもっと複雑）
          tripcode = crypto
            .createHash('sha256')
            .update(tripPassword)
            .digest('base64')
            .substring(0, 10);
        }
      }
      
      // IPハッシュ生成（日替わり）
      const ipHash = crypto
        .createHash('md5')
        .update(`${today}:${ipAddress}:salt`)
        .digest('hex')
        .substring(0, 8);

      // 投稿の作成
      const post = await prisma.post.create({
        data: {
          threadId,
          name: displayName,
          email,
          body,
          ipHash,
          tripcode,
          imageUrl: file?.url || null,
        },
      });
      
      // スレッドの更新日時を現在時刻に更新
      await prisma.thread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: '投稿の作成中にエラーが発生しました' });
    }
  } else if (req.method === 'GET') {
    // 指定されたスレッドの投稿を取得
    try {
      const { threadId } = req.query;
      
      if (!threadId || typeof threadId !== 'string') {
        return res.status(400).json({ error: 'スレッドIDが必要です' });
      }
      
      const posts = await prisma.post.findMany({
        where: {
          threadId: parseInt(threadId, 10),
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: '投稿の取得中にエラーが発生しました' });
    }
  }
  
  return res.status(405).json({ error: '許可されていないメソッドです' });
} 
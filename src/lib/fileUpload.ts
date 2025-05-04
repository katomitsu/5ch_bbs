import fs from 'fs';
import path from 'path';
import { IncomingForm, Part } from 'formidable';
import { NextApiRequest } from 'next';
import crypto from 'crypto';

// アップロードディレクトリの絶対パス
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// 画像ファイルパスを公開URLに変換する関数
export function getImageUrl(fileName: string): string {
  return `/uploads/${fileName}`;
}

// ファイル名を安全にハッシュ化する関数
function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName).toLowerCase();
  return `${timestamp}-${random}${extension}`;
}

// フォームデータを解析してアップロードされたファイルを処理する関数
export async function parseFormWithFile(req: NextApiRequest) {
  // アップロードディレクトリが存在しない場合は作成
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  
  return new Promise<{ fields: any; file?: { name: string; path: string; url: string } }>((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: UPLOADS_DIR,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part: Part): boolean => {
        // フィールドとImageファイルだけを処理
        return !!(
          part.name === 'image' && 
          part.mimetype && (
            part.mimetype.includes('image/jpeg') || 
            part.mimetype.includes('image/png') || 
            part.mimetype.includes('image/gif') ||
            part.mimetype.includes('image/webp')
          )
        );
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const imageFile = files.image?.[0];
      let file;

      if (imageFile) {
        // 安全なファイル名を生成
        const safeFileName = generateSafeFileName(imageFile.originalFilename || 'upload.jpg');
        const newPath = path.join(UPLOADS_DIR, safeFileName);
        
        // ファイル名を変更
        fs.renameSync(imageFile.filepath, newPath);
        
        file = {
          name: safeFileName,
          path: newPath,
          url: getImageUrl(safeFileName)
        };
      }

      resolve({
        fields,
        file
      });
    });
  });
} 
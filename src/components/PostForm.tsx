import { useState, useRef } from 'react';

type PostFormProps = {
  threadId: number;
  onPostSuccess?: () => void;
};

export default function PostForm({ threadId, onPostSuccess }: PostFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // ファイルサイズの制限 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('画像サイズは5MB以下にしてください');
        return;
      }
      
      // 許可するファイル形式
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('JPG, PNG, GIF, WebP形式の画像のみアップロードできます');
        return;
      }
      
      setImage(file);
      
      // プレビュー表示用のURLを作成
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!body.trim() && !image) {
      setError('本文または画像は必須です');
      return;
    }

    setIsSubmitting(true);

    try {
      // FormDataを使って画像とテキストデータの両方を送信
      const formData = new FormData();
      formData.append('threadId', threadId.toString());
      formData.append('name', name || '名無しさん');
      formData.append('email', email);
      formData.append('body', body);
      formData.append('ipAddress', '127.0.0.1'); // 実際の実装ではサーバー側で取得
      
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData, // FormDataを直接送信（Content-Typeは設定しない）
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '投稿に失敗しました');
      }

      // 成功したらフォームをリセット
      setName('');
      setEmail('');
      setBody('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 成功コールバックがあれば呼び出す
      if (onPostSuccess) {
        onPostSuccess();
      }
    } catch (err) {
      console.error('Post submission error:', err);
      setError(err instanceof Error ? err.message : '投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form mt-6">
      <h3 className="text-lg font-semibold mb-4">書き込み</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              名前
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名無しさん"
              className="input-field w-full px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              メール
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sage"
              className="input-field w-full px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              ※トリップ機能: 名前欄に「名前#パスワード」と入力
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-1">
            本文 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="input-field w-full px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            画像
          </label>
          <input
            type="file"
            id="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="form-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            ※JPG, PNG, GIF, WebP形式、5MB以下
          </p>
          
          {imagePreview && (
            <div className="mt-2 relative inline-block" style={{ maxWidth: '100%' }}>
              <img 
                src={imagePreview} 
                alt="プレビュー" 
                className="max-w-full rounded border border-gray-200"
                style={{ maxHeight: '200px', width: 'auto', height: 'auto' }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                aria-label="画像を削除"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary px-4 py-2 rounded"
          >
            {isSubmitting ? '送信中...' : '書き込む'}
          </button>
        </div>
      </form>
    </div>
  );
} 
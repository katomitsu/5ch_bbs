import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

type PostItemProps = {
  number: number;
  name: string;
  email?: string | null;
  trip?: string | null;
  ipHash?: string | null;
  createdAt: string;
  body: string;
  imageUrl?: string | null;
  isOp?: boolean;
};

export default function PostItem({
  number,
  name,
  email,
  trip,
  ipHash,
  createdAt,
  body,
  imageUrl,
  isOp = false,
}: PostItemProps) {
  // 改行をbrタグに変換
  const formattedBody = body.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

  return (
    <div className={`post-item ${isOp ? 'border-l-4 border-l-primary' : ''}`}>
      <div className="post-header flex flex-wrap items-center text-sm gap-x-2">
        <span className="font-bold text-primary">
          {number}
        </span>
        <span className="font-semibold">
          {name}
          {trip && <span className="ml-1 text-secondary">◆{trip}</span>}
        </span>
        {email && <span className="text-accent-foreground">✉️ {email}</span>}
        {ipHash && <span className="text-xs text-gray-500">ID:{ipHash}</span>}
        <span className="text-xs text-gray-500 ml-auto">
          {new Date(createdAt).toLocaleString("ja-JP")}
        </span>
      </div>
      <div className="mt-2 whitespace-pre-line text-sm">{formattedBody}</div>
      
      {imageUrl && (
        <div className="mt-3" style={{ maxWidth: '100%' }}>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={imageUrl} 
              alt="添付画像" 
              className="border border-gray-200 rounded hover:opacity-95"
              style={{ maxHeight: '200px', width: 'auto', height: 'auto' }}
            />
          </a>
        </div>
      )}
    </div>
  );
} 
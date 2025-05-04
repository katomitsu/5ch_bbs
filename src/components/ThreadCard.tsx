import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

type ThreadCardProps = {
  id: number;
  title: string;
  postCount: number;
  boardName: string;
  lastUpdated?: string | null;
  closed?: boolean;
};

export default function ThreadCard({ 
  id, 
  title, 
  postCount, 
  boardName, 
  lastUpdated, 
  closed = false 
}: ThreadCardProps) {
  return (
    <Link href={`/${boardName}/thread/${id}`} className="block hover:opacity-90 transition-opacity">
      <Card className={`h-full thread-card border-primary/30 overflow-hidden ${closed ? 'opacity-70' : ''}`}>
        <CardHeader className={`pb-2 ${closed ? 'bg-destructive/20' : 'board-header'}`}>
          <CardTitle className="text-lg pl-4">{title}</CardTitle>
          {closed && (
            <span className="text-xs text-destructive font-medium mt-1 bg-white/60 px-2 py-0.5 rounded-full inline-block ml-4">
              クローズ済み
            </span>
          )}
        </CardHeader>
        <CardContent className="pt-4 card-content-shadcn">
          <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1.5 rounded-full inline-flex">
            <MessageCircle size={16} className="text-secondary" />
            <span className="text-sm text-gray-700">{postCount}</span>
          </div>
        </CardContent>
        {lastUpdated && (
          <CardFooter className="pt-0 text-xs text-gray-500 card-footer-shadcn">
            最終更新: {new Date(lastUpdated).toLocaleString('ja-JP')}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
} 
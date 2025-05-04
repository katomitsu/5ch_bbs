import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

type BoardCardProps = {
  id: number;
  name: string;
  description?: string | null;
  threadCount: number;
  lastUpdated?: string | null;
};

export default function BoardCard({ id, name, description, threadCount, lastUpdated }: BoardCardProps) {
  return (
    <Link href={`/${name}`} className="block hover:opacity-90 transition-opacity">
      <Card className="h-full thread-card border-primary/30 overflow-hidden">
        <CardHeader className="board-header pb-2">
          <CardTitle className="text-lg pl-4">{name}</CardTitle>
          {description && <CardDescription className="text-gray-700 pl-4">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pt-4 card-content-shadcn">
          <div className="flex items-center">
            <div className="bg-primary/30 text-sm text-gray-700 px-2 py-1 rounded-full">
              スレッド数: {threadCount}
            </div>
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
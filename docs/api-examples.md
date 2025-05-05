# Supabase APIの使用例

このドキュメントでは、PrismaからSupabaseに移行する際のAPI使用例を提供します。

## 板（Board）の操作

### 板の一覧取得

```typescript
// Prismaの場合
const boards = await prisma.board.findMany();

// Supabaseの場合
const { data: boards, error } = await supabase
  .from('boards')
  .select('*')
  .order('id');
```

### 特定の板を取得

```typescript
// Prismaの場合
const board = await prisma.board.findUnique({
  where: { name: boardName }
});

// Supabaseの場合
const { data: board, error } = await supabase
  .from('boards')
  .select('*')
  .eq('name', boardName)
  .single();
```

## スレッド（Thread）の操作

### スレッド一覧の取得

```typescript
// Prismaの場合
const threads = await prisma.thread.findMany({
  where: { boardId: boardId },
  orderBy: { updatedAt: 'desc' }
});

// Supabaseの場合
const { data: threads, error } = await supabase
  .from('threads')
  .select('*')
  .eq('board_id', boardId)
  .order('updated_at', { ascending: false });
```

### スレッドの作成

```typescript
// Prismaの場合
const thread = await prisma.thread.create({
  data: {
    title: title,
    boardId: boardId,
    posts: {
      create: {
        name: name,
        email: email,
        body: body,
        ipHash: ipHash,
        tripcode: tripcode
      }
    }
  }
});

// Supabaseの場合
// 1. スレッドを作成
const { data: thread, error: threadError } = await supabase
  .from('threads')
  .insert({
    title: title,
    board_id: boardId
  })
  .select()
  .single();

// 2. 最初の投稿を作成
if (thread) {
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      thread_id: thread.id,
      name: name,
      email: email,
      body: body,
      ip_hash: ipHash,
      tripcode: tripcode
    });
}
```

## 投稿（Post）の操作

### スレッド内の投稿取得

```typescript
// Prismaの場合
const posts = await prisma.post.findMany({
  where: { threadId: threadId },
  orderBy: { createdAt: 'asc' }
});

// Supabaseの場合
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .eq('thread_id', threadId)
  .order('created_at', { ascending: true });
```

### 投稿の作成

```typescript
// Prismaの場合
const post = await prisma.post.create({
  data: {
    threadId: threadId,
    name: name,
    email: email,
    body: body,
    ipHash: ipHash,
    tripcode: tripcode,
    imageUrl: imageUrl
  }
});

// Supabaseの場合
const { data: post, error } = await supabase
  .from('posts')
  .insert({
    thread_id: threadId,
    name: name,
    email: email,
    body: body,
    ip_hash: ipHash,
    tripcode: tripcode,
    image_url: imageUrl
  })
  .select()
  .single();
```

### 画像のアップロード

```typescript
// Supabaseでの画像アップロード
const { data, error } = await supabase.storage
  .from('images')
  .upload(`public/${Date.now()}-${file.name}`, file);

// アップロードした画像のURLを取得
const imageUrl = data
  ? supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
  : null;
``` 
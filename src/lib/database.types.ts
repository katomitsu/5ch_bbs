export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      threads: {
        Row: {
          id: number
          title: string
          board_id: number
          closed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          board_id: number
          closed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          board_id?: number
          closed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          thread_id: number
          name: string
          email: string | null
          body: string
          created_at: string
          ip_hash: string
          tripcode: string | null
          image_url: string | null
        }
        Insert: {
          id?: number
          thread_id: number
          name?: string
          email?: string | null
          body: string
          created_at?: string
          ip_hash: string
          tripcode?: string | null
          image_url?: string | null
        }
        Update: {
          id?: number
          thread_id?: number
          name?: string
          email?: string | null
          body?: string
          created_at?: string
          ip_hash?: string
          tripcode?: string | null
          image_url?: string | null
        }
      }
    }
  }
} 
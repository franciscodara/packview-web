import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltam credenciais do Supabase no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos das tabelas
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  is_creator: boolean;
  is_verified: boolean;
}

export interface Post {
  id: string;
  creator_id: string;
  caption: string | null;
  media_urls: string[];
  is_private: boolean;
  price: number | null;
  likes_count: number;
  profiles?: Profile;
  has_purchased?: boolean;
}
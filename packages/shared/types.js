// Tipos compartidos para Donatello

export const roles = ['donor', 'institution', 'admin'] as const;

export type Role = typeof roles[number];

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  verified_at?: string;
  created_at: string;
}

export interface Institution {
  id: string;
  user_id: string;
  name: string;
  address: string;
  legal_doc_url?: string;
  verified: boolean;
}

export interface Listing {
  id: string;
  author_id: string;
  type: 'offer' | 'need';
  title: string;
  description: string;
  category: string;
  quantity: number;
  location: string;
  photos: string[];
  status: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  participants: string[];
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachments: string[];
  created_at: string;
}

export interface Donation {
  id: string;
  listing_id: string;
  donor_id: string;
  institution_id: string;
  status: string;
  agreed_pickup_datetime: string;
  proof_of_delivery_url?: string;
}

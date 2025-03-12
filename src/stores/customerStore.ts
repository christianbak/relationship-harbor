
import { create } from 'zustand';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead';
  type: 'individual' | 'business';
  createdAt: string;
  updatedAt: string;
  lastContact?: string;
  avatar?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

interface Contact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary: boolean;
  createdAt: string;
}

interface Activity {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  dueDate?: string;
  completed?: boolean;
}

interface CustomerState {
  selectedCustomerId: string | null;
  filterStatus: string | null;
  searchQuery: string;
  
  // Actions
  selectCustomer: (id: string | null) => void;
  setFilterStatus: (status: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  selectedCustomerId: null,
  filterStatus: null,
  searchQuery: '',
  
  selectCustomer: (id) => set(() => ({ selectedCustomerId: id })),
  setFilterStatus: (status) => set(() => ({ filterStatus: status })),
  setSearchQuery: (query) => set(() => ({ searchQuery: query })),
}));

// Types we'll use throughout the app
export type { Contact, Activity };

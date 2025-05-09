
// This is a mock hook to simulate Supabase functionality
// In a real app, this would use the actual Supabase client
import { useState } from 'react';

// Generic type for storage item
type StorageItem = {
  id: string;
  [key: string]: any;
};

const useSupabase = () => {
  // Mock database storage
  const [mockDb, setMockDb] = useState<{
    [table: string]: StorageItem[];
  }>({
    profiles: [],
    messages: [],
    chatSessions: [],
    contactForms: [],
  });

  // Mock function for inserting data
  const insert = async<T extends StorageItem>(
    table: string, 
    data: Omit<T, 'id'>
  ): Promise<T> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const id = Math.random().toString(36).substring(2, 15);
    const newItem = { ...data, id } as T;
    
    setMockDb((prev) => ({
      ...prev,
      [table]: [...(prev[table] || []), newItem],
    }));
    
    return newItem;
  };

  // Mock function for selecting data
  const select = async<T extends StorageItem>(
    table: string, 
    query?: { column: string; value: any }
  ): Promise<T[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const items = mockDb[table] || [];
    
    if (query) {
      return items.filter((item) => item[query.column] === query.value) as T[];
    }
    
    return items as T[];
  };

  // Mock function for updating data
  const update = async<T extends StorageItem>(
    table: string, 
    id: string, 
    data: Partial<T>
  ): Promise<T> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    let updated: T | null = null;
    
    setMockDb((prev) => {
      const tableData = prev[table] || [];
      const updatedTable = tableData.map((item) => {
        if (item.id === id) {
          updated = { ...item, ...data } as T;
          return updated;
        }
        return item;
      });
      
      return {
        ...prev,
        [table]: updatedTable,
      };
    });
    
    if (!updated) {
      throw new Error(`Item with id ${id} not found in table ${table}`);
    }
    
    return updated;
  };

  // Mock function for deleting data
  const remove = async(
    table: string, 
    id: string
  ): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMockDb((prev) => {
      const tableData = prev[table] || [];
      const updatedTable = tableData.filter((item) => item.id !== id);
      
      return {
        ...prev,
        [table]: updatedTable,
      };
    });
  };

  // Mock file storage
  const storage = {
    uploadFile: async (bucket: string, path: string, file: File): Promise<string> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a mock URL
      const url = URL.createObjectURL(file);
      
      return url;
    },
    
    getPublicUrl: (bucket: string, path: string): string => {
      return `https://mockbucket/${bucket}/${path}`;
    },
    
    removeFile: async (bucket: string, path: string): Promise<void> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Nothing to do in the mock implementation
    }
  };

  return {
    db: {
      insert,
      select,
      update,
      remove,
    },
    storage,
  };
};

export default useSupabase;

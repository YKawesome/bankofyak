import { supabase } from './client';

// Example: Fetch all transactions
export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*');
  if (error) throw error;
  return data;
};

// Example: Add a transaction
export const addTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction]);
  if (error) throw error;
  return data;
};

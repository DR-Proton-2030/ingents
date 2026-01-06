import { api } from '@/utils/api';
import React, { useState } from 'react'

const useSearchUser = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<any[]>([]);
    const searchUser = async (query: string) => {
        try{
            setLoading(true);
            const filter = {
                query
            }
            const response = await api.user.searchUsers(filter);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>useSearchUser</div>
  )
}

export default useSearchUser
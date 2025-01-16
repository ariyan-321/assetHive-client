import React from 'react'
import useAxiosSecure from '../../Hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query';

export default function RequestForAnAsset() {

    const axiosSecure=useAxiosSecure();

    const {data:assets,refetch}=useQuery({
        queryKey:["assets"],
        queryFn:async()=>{
            
        }
    })

  return (
    <div>RequestForAnAsset</div>
  )
}

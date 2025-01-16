import React, { useContext } from 'react'
import { authContext } from '../../Provider.jsx/AuthProvider'
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

export default function MyEmployeeList() {
    const{user}=useContext(authContext);
    const axiosSecure=useAxiosSecure();

    const{data:employees}=useQuery({
        queryKey:["employees"],
        queryFn:async()=>{
            const{data}=await axiosSecure.get(`/employees/list/${user?.email}`)
            return data;
        }
    })

    console.log(employees)

  return (
    <div>MyEmployeeList</div>
  )
}

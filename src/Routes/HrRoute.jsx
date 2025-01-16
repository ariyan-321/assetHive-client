import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '../Hooks/useAxiosPublic'
import { authContext } from '../Provider.jsx/AuthProvider'
import LoadingSpinner from '../Components/SubComponents/LoagingSpinner'

 const HrRoute = ({children}) => {

    const location = useLocation()
  
    const { user } = useContext(authContext);

    const axiosPublic = useAxiosPublic();
  
    const { data, isLoading, refetch } = useQuery({
      queryKey: ["users", user],
      queryFn: async () => {
        const { data } = await axiosPublic.get(`/users/${user?.email}`);
        console.log(data);
        return data;
      },
      enabled: !!user?.email,
    });



    if (isLoading) return <LoadingSpinner />
    if (data.role==="hr-manager") return children


    return <Navigate to='/login'  replace='true' />
  
}

export default HrRoute

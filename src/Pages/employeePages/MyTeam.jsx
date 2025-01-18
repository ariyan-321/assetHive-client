import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';

export default function MyTeam() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetch the employee data
  const { data: employee, isLoading, refetch } = useQuery({
    queryKey: ["user", user], // Changed queryKey to 'user' to make it unique
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user?.email}`);
      console.log(data);
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch the team members data
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["teamMembers", employee?.companyEmail], // Using unique queryKey for teamMembers
    queryFn: async () => {
      if (!employee?.companyEmail) return []; // Handle case where companyEmail is not available
      const { data } = await axiosSecure.get(`/team/${employee?.companyEmail}`);
      return data;
    },
    enabled: !!employee?.companyEmail, // Ensure it only runs when companyEmail is available
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        My Team
      </h1>
      {teamLoading ? (
        <p className="text-center text-lg">Loading team members...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers?.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white border border-gray-200 rounded-xl shadow-lg transform hover:scale-105 transition-transform p-6 flex flex-col items-center"
              >
                <img
                  src={member.image || 'https://i.ibb.co/FgjMByT/ariyan.jpg'}
                  alt={member.name}
                  className="w-28 h-28 object-cover rounded-full mb-6 border-4 border-blue-500"
                />
                <h3 className="text-xl font-semibold text-blue-600">{member.user?.name}</h3>
                <p className="text-sm text-gray-600">{member.user?.role}</p>
                <p className="text-sm text-gray-500">{member.company}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-500">No team members found</p>
          )}
        </div>
      )}
    </div>
  );
}

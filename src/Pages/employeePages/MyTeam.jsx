import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { Helmet } from 'react-helmet';

export default function MyTeam() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Change this to display the number of items per page

  // Fetch the employee data
  const { data: employee, isLoading, refetch } = useQuery({
    queryKey: ["user", user],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch the team members data
  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["teamMembers", employee?.companyEmail],
    queryFn: async () => {
      if (!employee?.companyEmail) return [];
      const { data } = await axiosSecure.get(`/team/${employee?.companyEmail}`);
      return data;
    },
    enabled: !!employee?.companyEmail,
  });

  // Calculate total number of pages
  const totalPages = teamMembers ? Math.ceil(teamMembers.length / itemsPerPage) : 1;

  // Get current page's team members
  const currentTeamMembers = teamMembers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Helmet>
        <title>AssetHive | MyTeam</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">My Team</h1>
      {teamLoading ? (
        <p className="text-center text-lg">Loading team members...</p>
      ) : (
        <div>
          {/* Team Members List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentTeamMembers?.length > 0 ? (
              currentTeamMembers.map((member) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

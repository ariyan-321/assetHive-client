import React, { useContext } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

export default function MyEmployeeList() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/employees/list/${user?.email}`);
      return data;
    },
  });

  if (isLoading) {
    return <p>Loading employees...</p>;
  }

  if (isError) {
    return <p>Error loading employees. Please try again.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Employee List</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Company</th>
              <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {employees?.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.role}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.user?.dateOfBirth || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

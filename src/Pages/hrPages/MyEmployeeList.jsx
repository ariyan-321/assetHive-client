import React, { useContext, useState, useEffect } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

export default function MyEmployeeList() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [paginatedEmployees, setPaginatedEmployees] = useState([]);

  // Fetching employee list
  const { data: employees, isLoading, isError, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/employees/list/${user?.email}`);
      return data;
    },
  });

  // Handle pagination
  useEffect(() => {
    if (employees?.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedEmployees(employees.slice(startIndex, endIndex));
    }
  }, [employees, currentPage]);

  // Remove employee function with SweetAlert2 confirmation
  const handleRemoveEmployee = async (employeeId, userId) => {
    // SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Perform deletion after confirmation
          await axiosSecure.delete(`/employees/remove/${employeeId}`);

          // Update user data to remove company association
          await axiosSecure.patch(`/update-employee/${userId}`, {
            company: null,
            companyImage: null,
            companyEmail: null,
          });

          toast.success('Employee removed successfully');
          refetch(); // Refetch the employee list after successful operations

          Swal.fire('Deleted!', 'The employee has been removed.', 'success');
        } catch (error) {
          toast.error('Failed to remove employee');
          console.error('Error removing employee:', error);
        }
      }
    });
  };

  // Pagination helpers
  const totalPages = Math.ceil((employees?.length || 0) / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return <p className="text-center">Loading employees...</p>;
  }

  if (isError) {
    return <p className="text-center">Error loading employees. Please try again.</p>;
  }

  return (
    <div className="p-6 container mx-auto ">
      <Helmet>
        <title>AssetHive | MyEmployeeList</title>
      </Helmet>
      <h1 className="text-3xl font-semibold mb-6 ">My Employee List: ({employees?.length || 0})</h1>
      <div className="overflow-x-auto text-black bg-white shadow-lg rounded-lg">
        <table className="table-auto w-full text-sm md:text-base border-collapse border border-gray-300">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Company</th>
              <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees?.length > 0 ? (
              paginatedEmployees.map((employee, index) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      className="w-[40px] h-[40px] rounded-lg object-cover"
                      src={employee?.user?.image}
                      alt={employee?.user?.name}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.role}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.user?.dateOfBirth || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveEmployee(employee._id, employee.user._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 ">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

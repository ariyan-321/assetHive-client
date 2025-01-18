import React, { useContext } from 'react';
import { authContext } from '../../Provider.jsx/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function MyEmployeeList() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();

  // Fetching employee list
  const { data: employees, isLoading, isError, refetch } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/employees/list/${user?.email}`);
      return data;
    },
  });

  // Remove employee function with SweetAlert2 confirmation
  const handleRemoveEmployee = async (employeeId) => {
    // SweetAlert2 confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Perform deletion after confirmation
          await axiosSecure.delete(`/employees/remove/${employeeId}`);
          toast.success('Employee removed successfully');
          refetch(); // Refetch the employee list after deletion
          Swal.fire('Deleted!', 'The employee has been removed.', 'success');
        } catch (error) {
          toast.error('Failed to remove employee');
          console.error('Error removing employee:', error);
        }
      }
    });
  };

  if (isLoading) {
    return <p className="text-center">Loading employees...</p>;
  }

  if (isError) {
    return <p className="text-center">Error loading employees. Please try again.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">My Employee List</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
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
            {employees?.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img className="w-[40px] h-[40px] rounded-lg object-cover" src={employee?.user?.image} alt={employee?.user?.name} />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee?.user?.role}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.user?.dateOfBirth || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleRemoveEmployee(employee._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-600">
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

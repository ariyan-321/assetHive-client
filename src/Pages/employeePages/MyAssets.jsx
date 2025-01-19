import React, { useContext } from "react";
import { authContext } from "../../Provider.jsx/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

export default function MyAssets() {
  const { user } = useContext(authContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const { data: company } = useQuery({
    queryKey: ["users", user],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/users/${user?.email}`);
      console.log(data);
      return data;
    },
    enabled: !!user?.email,
  });

  console.log("company", company);

  // Fetch requests data
  const { data: requests, refetch } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/employee/requests/${user?.email}`
      );
      return data;
    },
  });

  // Handle the return action for an asset
  const handleReturn = async (assetId) => {
    // Show a confirmation alert using SweetAlert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to return this asset?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, return it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
    });

    // If confirmed, proceed to return the asset
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/requests/return/${assetId}`);
        if (res.data.success) {
          toast.success("Asset returned successfully!");
          refetch();
        } else {
          toast.error("Failed to return asset.");
        }
      } catch (error) {
        console.error("Error returning asset:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.info("Asset return was canceled.");
    }
  };

  // Handle the cancel request action
  const handleCancelRequest = async (requestId) => {
    // Show a confirmation alert using SweetAlert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
    });

    // If confirmed, proceed to cancel the request
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/requests/cancel/${requestId}`);
        if (res.data.success) {
          toast.success("Request canceled successfully!");
          refetch();
        } else {
          toast.error("Failed to cancel request.");
        }
      } catch (error) {
        console.error("Error canceling request:", error);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.info("Request cancellation was canceled.");
    }
  };

  // Function to format date to "MM/DD/YYYY"
  const formatDate = (date) => {
    if (!date) return "N/A";
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Create a PDF Document for printing asset details
  const PrintDocument = ({ request }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{company?.company || "N/A"}</Text>
          <Text style={styles.companyInfo}>
            {company?.companyEmail || "N/A"}
          </Text>
          {company?.companyImage && (
            <Image src={company?.companyImage} style={styles.companyImage} />
          )}
        </View>

        <View style={styles.details}>
          <Text>
            <strong>Asset Name:</strong> {request.asset.name}
          </Text>
          <Text>
            <strong>Asset Type:</strong> {request.asset.type}
          </Text>
          <Text>
            <strong>Status:</strong> {request.status}
          </Text>
          <Text>
            <strong>Request Date:</strong> {formatDate(request.requestDate)}
          </Text>
          <Text>
            <strong>Approval Date:</strong> {formatDate(request.approvalDate)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.printDate}>
            Printed on: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );

  const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { marginBottom: 20, textAlign: "center" },
    companyName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    companyImage: { width: 40, height: 40, marginBottom: 3 },
    details: { marginBottom: 20, fontSize: 12 },
    footer: { position: "absolute", bottom: 20, left: 20, textAlign: "left" },
    printDate: { fontSize: 10, fontStyle: "italic" },
  });
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg container mx-auto mt-6">
      <h1 className="text-3xl font-semibold text-center  mb-6">
        My Assets
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Request Date</th>
              <th className="border border-gray-300 px-4 py-2">Approve Date</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests?.length > 0 ? (
              requests.map((request, index) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={request.asset.image}
                      alt={request.asset.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.asset.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.asset.type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(request.requestDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(request.approvalDate)}
                  </td>
                  <td className="border flex justify-around items-center border-gray-300 px-4 py-4 text-center">
                    {request.status === "pending" ? (
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Cancel Request
                      </button>
                    ) : request.status === "approved" ? (
                      <>
                        <PDFDownloadLink
                          document={<PrintDocument request={request} />}
                          fileName={`${request.asset.name}_Details.pdf`}
                        >
                          {({ loading }) =>
                            loading ? <h1 className="font-semibold ">loading..</h1> : <h1 className="font-semibold underline">Print Info</h1>
                          }
                        </PDFDownloadLink>
                        {request.asset.type === "Returnable" && (
                          <button
                            onClick={() => handleReturn(request._id)}
                            className={`px-4 py-2 rounded transition ${
                              request.status === "returned"
                                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            disabled={request.status === "returned"}
                          >
                            Return
                          </button>
                        )}
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No asset requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

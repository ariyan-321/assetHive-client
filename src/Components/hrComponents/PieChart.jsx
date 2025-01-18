import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { authContext } from "../../Provider.jsx/AuthProvider";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Label } from "recharts";

export default function PieChartComponent() {
  const [pieData, setPieData] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(authContext);

  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data } = await axiosSecure(`requests/all/${user?.email}`);
      return data; // Return the data
    },
  });

  useEffect(() => {
    if (items) {
      // Process the items data to count returnable and non-returnable items
      const returnable = items.filter(
        (item) => item?.asset?.type === "Returnable"
      ).length;
      const nonReturnable = items.filter(
        (item) => item?.asset?.type === "Non-Returnable"
      ).length;

      // Prepare the data for Pie chart
      setPieData([
        { name: "Returnable", value: returnable },
        { name: "Non-Returnable", value: nonReturnable },
      ]);
    }
  }, [items]);

  const COLORS = ["#0088FE", "#FF8042"]; // Colors for the slices

  // Function to format the percentage labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10; // distance from the center
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = ((value / items.length) * 100).toFixed(1); // Calculate percentage
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill="#000" // Set label color to black
        fontSize={14}
        fontWeight="600" // Make the label semi-bold
        
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (isLoading) return <div className="text-center text-xl font-semibold">Loading...</div>;
  if (isError) return <div className="text-center text-xl text-red-500 font-semibold">Error: {error?.message || "An error occurred"}</div>;
  if (!items || items.length === 0)
    return <div className="text-center text-xl text-gray-500">No items found for this user.</div>;

  return (
    <div className="pie-chart-container p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-center text-2xl font-semibold text-blue-600 mb-6">Items Requested by Type</h2>
      <ResponsiveContainer width="100%"  height={500}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
            label={renderCustomizedLabel} // Use custom label function to show percentage
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="cursor-pointer hover:scale-105 transition-all duration-300" // Add hover effect
              />
            ))}
          </Pie>
          <Legend
            iconSize={20}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "10px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

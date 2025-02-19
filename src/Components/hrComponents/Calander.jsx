import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default calendar styles

export default function Calander() {
  const [date, setDate] = useState(new Date());

  // Handle date change
  const onChange = (newDate) => setDate(newDate);

  return (
    <div className="w-[85%] mx-auto p-6 sm:p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center  mb-6">Company Calendar</h1>

      <div className=" rounded-lg shadow-lg p-6 flex justify-center items-center">
        <Calendar
          onChange={onChange}
          value={date}
          className="react-calendar rounded-lg"
        />
      </div>

      <div className="text-center mt-4">
        <p className="text-xl ">Selected Date: {date.toDateString()}</p>
      </div>
    </div>
  );
}

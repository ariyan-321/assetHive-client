import React from 'react'

export default function HrEvents() {
  const events = [
    {
      title: "Annual Company Picnic",
      date: "March 15, 2025",
      description: "Join us for a fun-filled day of games, food, and team-building activities.",
      image: "https://i.ibb.co.com/2dCDF3h/picnic.jpg",
    },
    {
      title: "Team Development Workshop",
      date: "April 5, 2025",
      description: "An interactive workshop to help enhance team collaboration and productivity.",
      image: "https://i.ibb.co.com/pLcHydh/workshop.jpg",
    },
    {
      title: "Charity Run",
      date: "May 20, 2025",
      description: "A charity event to raise funds for local communities. Join us for a run for a cause!",
      image: "https://i.ibb.co.com/Gd8KG0j/charity.jpg",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center ">Upcoming Company Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105">
            <img className="w-full h-48 object-cover rounded-t-lg" src={event.image} alt={event.title} />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{event.date}</p>
              <p className="text-gray-700 mt-2">{event.description}</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition">RSVP</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

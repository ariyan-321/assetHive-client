import React from "react";

export default function Reviews() {
  const reviews = [
    {
      name: "John Doe",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/1200px-John_Doe%2C_born_John_Nommensen_Duchac.jpg",
      review:
        "This platform has been amazing! It helped us find volunteers effortlessly.",
      rating: 5,
    },
    {
      name: "Jane Smith",
      image:
        "https://i.pinimg.com/736x/2a/26/df/2a26df12b8fab576a93f244212cb6673.jpg",
      review:
        "A seamless experience! Highly recommend this service to everyone.",
      rating: 4,
    },
    {
      name: "Michael Johnson",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxAA8303_86z01TPPqxwesKe7q_OJSJgWxvg&s",
      review: "Great platform with excellent features and user support.",
      rating: 5,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-green-600">
        Client Reviews
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="card shadow-xl border-2 border-white rounded-lg p-4"
          >
            <div className="card-body items-center text-center">
              <img
                src={review.image}
                alt={review.name}
                className="rounded-full w-24 h-24 mb-4 border-2 border-green-600"
              />
              <h3 className="text-lg font-semibold">{review.name}</h3>
              <p className=" italic">"{review.review}"</p>
              <div className="mt-3">
                <div className="rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <input
                      key={i}
                      type="radio"
                      className={`mask mask-star-2 bg-yellow-400 ${
                        i < review.rating ? "checked" : ""
                      }`}
                      readOnly
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

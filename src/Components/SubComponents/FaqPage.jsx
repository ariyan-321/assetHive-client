import React from "react";

export default function FaqPage() {
  const faqs = [
    {
      question: "How can I sign up for an account?",
      answer:
        "Click on the 'Sign Up' button at the top-right corner and fill in your details.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and bank transfers.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription through your account settings.",
    },
  ];

  return (
    <div>
      <div className="faq mt-20 w-full">
        <h1 className="font-semibold text-center text-3xl my-12">
          Frequently Asked Questions
        </h1>
        <div className="w-[90%]  mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              tabIndex={index}
              className="collapse collapse-arrow border border-gray-200 rounded-md mb-4"
            >
              <div className="collapse-title font-medium text-lg">
                {faq.question}
              </div>
              <div className="collapse-content">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

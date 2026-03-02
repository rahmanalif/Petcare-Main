"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "1.How does the Ainova AI assistant work?",
    answer:
      "Pet boarding is a service where your pet stays at a host's home while you're away. It's a comfortable, safe, and loving environment for your furry friend.",
  },
  {
    question: "2.Can Ainova answer phone calls, WhatsApp, and emails?",
    answer:
      "You can find reliable sitters by reading reviews, checking their experience, and scheduling a meet-and-greet before booking. All sitters on our platform are vetted for quality and safety.",
  },
  {
    question: "3.Is the AI available 24/7 for my customers?",
    answer:
      "Doggy day care typically includes supervised playtime with other dogs, feeding, and rest periods. It's a great way to socialize your dog and keep them active.",
  },
  {
    question: "4.Do I need special hardware or installation?",
    answer:
      "Yes, you can schedule dog walking services for specific times and durations that fit your needs. You can coordinate directly with the walker to set up a regular schedule.",
  },
  {
    question: "5.Do I need to create an account to book a service?",
    answer:
      "Yes, you can schedule dog walking services for specific times and durations that fit your needs. You can coordinate directly with the walker to set up a regular schedule.",
  },
  {
    question: "6.How quickly can Ainova be set up for my business?",
    answer:
      "Yes, you can schedule dog walking services for specific times and durations that fit your needs. You can coordinate directly with the walker to set up a regular schedule.",
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div id="faqs" className="bg-[#F8F4EF] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#024B5E] sm:text-4xl font-bakso">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#024B5E]">
            This section gives you clear and simple answers about how our AI assistant helps your business handle calls, messages, and customer requests more efficiently.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-lg p-6 transition-colors duration-300 ${
                  openFaq === index
                    ? "bg-[#035F75] divide-white/20"
                    : "bg-[#F8F4EF] divide-gray-900/10"
                }`}
              >
                <dt>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-start justify-between text-left"
                  >
                    <span className={`text-base font-semibold leading-7 ${
                      openFaq === index ? "text-white" : "text-[#024B5E]"
                    }`}>
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDown
                        className={`h-6 w-6 transition-transform duration-300 ${
                          openFaq === index ? "rotate-180 text-white" : "text-[#024B5E]"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </dt>
                {openFaq === index && (
                  <dd className="mt-6 pr-12">
                    <p className="text-base leading-7 text-white">
                      {faq.answer}
                    </p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

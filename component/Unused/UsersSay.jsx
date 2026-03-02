"use client";

import Star from "../home/StarIcon";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "John Walker",
      role: "CEO, company",
      rating: 4,
      text: "I've tried many platforms, but UI Wiki stands out for its attention to detail and clean aesthetics. Highly recommend!",
      avatar: "/client/Ellipse  (1).png",
    },
    {
      id: 2,
      name: "Harry Maguire",
      role: "CFO, company",
      rating: 4,
      text: "UI Wiki transformed our design process! The templates are modern, user-friendly, and saved us countless hours",
      avatar: "/client/Ellipse  (3).png",
    },
    {
      id: 3,
      name: "Kate Wilson",
      role: "CTO, company",
      rating: 4,
      text: "As a freelance designer, UI Wiki has become my go-to design solution for all my projects",
      avatar: "/client/Ellipse  (2).png",
    },
  ];

  const testimonials2 = [
    {
      id: 4,
      name: "James Anderson",
      role: "CEO, company",
      rating: 3,
      text: "The user interface and sleek templates of UI Wiki helped me create a stunning portfolio website in just a day!",
      avatar: "/client/Ellipse  (4).png",
    },
    {
      id: 5,
      name: "Edgar Davids",
      role: "UI Designer, company",
      rating: 4,
      text: "UI Wiki's grid section templates are visually impressive and easy to customize. They've elevated my project presentations.",
      avatar: "/client/Ellipse  (5).png",
    },
    {
      id: 6,
      name: "Ashley cook",
      role: "UX Designer, company",
      rating: 5,
      text: "We revamped our company website using UI Wiki, and the feedback has been overwhelmingly positive!",
      avatar: "/client/Ellipse  (2).png",
    },
  ];

  // Duplicate arrays for seamless infinite scroll
  const duplicatedRow1 = [...testimonials, ...testimonials, ...testimonials];
  const duplicatedRow2 = [...testimonials2, ...testimonials2, ...testimonials2];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "fill-red-400 text-red-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-[#ffffff] rounded-2xl p-8 shadow-2xs hover:shadow-2xl transition-shadow shrink-0 w-[450px] mx-4 font-bold">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-3xl overflow-hidden">
            <img
              src={testimonial.avatar}
              alt="Profile/client"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">
              {testimonial.name}
            </h4>
            <p className="text-gray-600 text-sm">{testimonial.role}</p>
          </div>
        </div>
        {renderStars(testimonial.rating)}
      </div>
      <div className="text-red-400 text-5xl mb-4 leading-none">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 35H35C35.663 35 36.2989 34.7366 36.7678 34.2678C37.2366 33.7989 37.5 33.163 37.5 32.5V22.5C37.5 21.837 37.2366 21.2011 36.7678 20.7322C36.2989 20.2634 35.663 20 35 20H27.5C27.5 14.485 31.985 10 37.5 10V5C29.2275 5 22.5 11.7275 22.5 20V32.5C22.5 33.163 22.7634 33.7989 23.2322 34.2678C23.7011 34.7366 24.337 35 25 35ZM5 35H15C15.663 35 16.2989 34.7366 16.7678 34.2678C17.2366 33.7989 17.5 33.163 17.5 32.5V22.5C17.5 21.837 17.2366 21.2011 16.7678 20.7322C16.2989 20.2634 15.663 20 15 20H7.5C7.5 14.485 11.985 10 17.5 10V5C9.2275 5 2.5 11.7275 2.5 20V32.5C2.5 33.163 2.76339 33.7989 3.23223 34.2678C3.70107 34.7366 4.33696 35 5 35Z"
            fill="#FE6C5D"
          />
        </svg>
      </div>
      <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
    </div>
  );

  return (
    <div className="bg-[#F8F4EF] py-16 px-8 overflow-hidden ">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2
          className="text-5xl md:text-6xl text-[#024B5E] mb-4 tracking-wide font-bakso"
          //   style={{ fontFamily: 'Comic Sans MS, cursive' }}
        >
          What Our Users Say
        </h2>
        <p className="text-[#024B5E] text-lg font-normal">
          Hear the trusted feedback from customers who have put their faith in
          us
        </p>
      </div>

      {/* First Row - moves right to left */}
      <div className="mb-8 relative">
        <div className="flex animate-scroll-left">
          {duplicatedRow1.map((testimonial, index) => (
            <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Second Row - moves left to right */}
      <div className="relative">
        <div className="flex animate-scroll-right">
          {duplicatedRow2.map((testimonial, index) => (
            <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-33.33%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

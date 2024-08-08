import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  CursorArrowRaysIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const contentSections = [
  {
    title: "Real-Time Market Insights",
    description:
      "Stay informed with up-to-the-minute market data. Our intuitive dashboard provides a comprehensive overview of current meal point prices, recent transactions, and market trends.",
    features: [
      "Live price updates",
      "Historical price charts",
      "Transaction volume indicators",
      "Market recommendations",
    ],
    image: "/market-info.png",
  },
  {
    title: "Effortless Bidding Process",
    description:
      "Place your bid with ease and confidence. Our streamlined bidding page allows you to set your desired price and quantity, while providing helpful market guidance to ensure you make informed decisions.",
    features: [
      "One-click bid placement",
      "Market-based price suggestions",
      "Flexible quantity options",
      "Instant bid confirmation",
    ],
    image: "/bid-page.png",
  },
  {
    title: "Seamless Match Notifications",
    description:
      "Experience the joy of a perfect match! When our system finds an ideal buyer or seller for your bid, you'll receive instant email with all the details you need to complete your transaction.",
    features: [
      "Real-time match alerts",
      "Detailed transaction summaries",
      "Easy transaction finalization",
    ],
    image: "/match-page.png",
  },
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ease-in-out
          backdrop-filter backdrop-blur-lg bg-opacity-85
          ${scrolled ? "border-b pt-0" : "pt-2"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <NavLink to="/home" className="flex items-center">
                <img
                  src="/pawlogo.png"
                  alt="The Bear Bazaar logo"
                  className="h-7 mr-3"
                />
                <span className="text-2xl font-bold text-gray-900">
                  The Bear Bazaar
                </span>
              </NavLink>
            </div>
            <div>
              <NavLink
                to="/auth"
                className="inline-flex items-center pl-4 pr-[14px] py-[7px] border border-transparent text-md font-medium rounded-full text-white bg-mainLight hover:bg-[#941214] transition duration-150 ease-in-out"
              >
                <span>Sign In</span>
                <ChevronRightIcon
                  className="h-[14px] ml-2 mt-[2px]"
                  strokeWidth={2.5}
                />
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-36">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 z-10">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Safe, Fair, and Easy</span>
                <span className="block text-mainLight">
                  Meal Point Exchange
                </span>
                <span className="block">for WashU Students</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                We've revolutionized meal point exchange for WashU students. Our
                secure marketplace eliminates haggling and prevents scams,
                making transactions effortless.
              </p>
              <div className="mt-5 sm:mt-8">
                <NavLink
                  to="/auth"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-mainLight hover:bg-[#941214] md:py-3 md:text-lg md:px-8 transition duration-150 ease-in-out"
                >
                  Get Started
                </NavLink>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 lg:relative">
              <div className="lg:absolute lg:left-0 lg:right-[-35%] lg:top-1/2 lg:transform lg:-translate-y-1/2">
                <img
                  src="/hero.png"
                  alt="The Bear Bazaar mockup"
                  className="w-full h-auto object-contain"
                  width="1183"
                  height="787"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Automated Matching",
                desc: "Say goodbye to endless haggling! Our algorithm instantly connects you with the best deal, saving you time and ensuring fair prices for everyone.",
                icon: CursorArrowRaysIcon,
              },
              {
                title: "Secure Authentication",
                desc: "Trade with confidence knowing you're part of a verified WashU community. Our email verification keeps your transactions safe and scam-free.",
                icon: ShieldCheckIcon,
              },
              {
                title: "Transparent Transactions",
                desc: "Make informed decisions with our real-time market insights. View anonymized transaction data to understand pricing trends and get the best value for your meal points.",
                icon: ChartBarIcon,
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <feature.icon
                      className="h-8 w-8 text-mainLight"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="ml-3 text-xl font-medium text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-base text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections with Mockups */}
      {contentSections.map((section, index) => (
        <div key={index} className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="lg:flex lg:items-center lg:justify-between">
              {index % 2 === 1 ? (
                <>
                  <div className="lg:w-1/2 mt-10 lg:mt-0">
                    <div className="overflow-hidden">
                      <img
                        src={section.image}
                        alt={`${section.title} mockup`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                  <div className="lg:w-1/2 my-8 lg:pl-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-lg text-gray-500">
                      {section.description}
                    </p>
                    <ul className="mt-8 space-y-4">
                      {section.features.map((item, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 text-mainLight">
                            <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <p className="ml-3 text-base text-gray-700">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:w-1/2 my-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-lg text-gray-500">
                      {section.description}
                    </p>
                    <ul className="mt-8 space-y-4">
                      {section.features.map((item, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 text-mainLight">
                            <CheckIcon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <p className="ml-3 text-base text-gray-700">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-10 lg:mt-0 lg:w-1/2">
                    <div className="overflow-hidden">
                      <img
                        src={section.image}
                        alt={`${section.title} mockup`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-center lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 The Bear Bazaar. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

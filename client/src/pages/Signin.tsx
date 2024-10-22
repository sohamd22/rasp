"use client";
import { motion } from "framer-motion";

import React, { useEffect, useState } from "react";
import { GoogleGeminiEffect } from "../components/GoogleGeminiEffect";

const Signin: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-center items-center">
      {/* Background Section with Scrolls */}
      <section className="absolute inset-0 z-[-1] flex justify-between ">
        <div className="relative z-[-1] flex justify-between w-full flex-row ">
          <InfiniteScroll
            direction="horizontal-left"
            speed={40}
            smallDirection="vertical-up"
          >
            <Cards
              items={[
                ["soham daga", "/team/soham.jpg", "technical director"],
                ["dhanush vardhan", "/team/dhanush.jpg", "president"],
                ["bhoomi singhani", "/team/bhoomi.jpeg", "vp of operations"],
                ["chakshu jain", "/team/chakshu.JPG", "vp of finance"],
                ["aryan keluskar", "/team/aryan.png", "industry director"],
                ["adwait more", "/team/adwait.jpg", "marketing director"],
                ["devansh gupta", "/team/devansh.png", "industry officer"],
                ["aditya bohra", "/team/aditya.jpg", "marketing officer"],
                ["riya ubhe", "/team/riya.jpg", "marketing officer"],
                ["anay shirolkar", "/team/anay.jpg", "marketing officer"],
              ]}
              className=""
              imageClass="mix-blend-multiply max-h-96 w-full"
            />
          </InfiniteScroll>
          <InfiniteScroll
            direction="vertical-down"
            speed={45}
            smallDirection="vertical-down"
          >
            <Cards
              items={[
                ["soham daga", "/team/soham.jpg", "technical director"],
                ["dhanush vardhan", "/team/dhanush.jpg", "president"],
                ["bhoomi singhani", "/team/bhoomi.jpeg", "vp of operations"],
                ["chakshu jain", "/team/chakshu.JPG", "vp of finance"],
                ["aryan keluskar", "/team/aryan.png", "industry director"],
                ["adwait more", "/team/adwait.jpg", "marketing director"],
                ["devansh gupta", "/team/devansh.png", "industry officer"],
                ["aditya bohra", "/team/aditya.jpg", "marketing officer"],
                ["riya ubhe", "/team/riya.jpg", "marketing officer"],
                ["anay shirolkar", "/team/anay.jpg", "marketing officer"],
              ]}
              className=""
              imageClass="mix-blend-multiply max-h-96 w-full"
            />
          </InfiniteScroll>
          {window.innerWidth >= 768 && (
            <InfiniteScroll
              direction="horizontal-right"
              speed={40}
              smallDirection="vertical-up"
            >
              <Cards
                items={[
                  ["soham daga", "/team/soham.jpg", "technical director"],
                  ["dhanush vardhan", "/team/dhanush.jpg", "president"],
                  ["bhoomi singhani", "/team/bhoomi.jpeg", "vp of operations"],
                  ["chakshu jain", "/team/chakshu.JPG", "vp of finance"],
                  ["aryan keluskar", "/team/aryan.png", "industry director"],
                  ["adwait more", "/team/adwait.jpg", "marketing director"],
                  ["devansh gupta", "/team/devansh.png", "industry officer"],
                  ["aditya bohra", "/team/aditya.jpg", "marketing officer"],
                  ["riya ubhe", "/team/riya.jpg", "marketing officer"],
                  ["anay shirolkar", "/team/anay.jpg", "marketing officer"],
                ]}
                className=""
                imageClass="mix-blend-multiply max-h-96 w-full"
              />
            </InfiniteScroll>
          )}
        </div>
        {/* Black overlay */}
        <div className="absolute w-screen h-screen inset-0 bg-black opacity-50 z-10"></div>
      </section>

      {/* Foreground Section with Content */}
      <section className="z-[100] w-screen flex justify-center items-center">
        <div className="text-center flex flex-col">
          <div className="flex flex-col text-center text-transparent text-5xl  leading-tight mb-10 md:text-8xl" style={{fontFamily: "Poppins, sans-serif"}}>
            <h1 className="font-semibold stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">r</span>etrieval
            </h1>
            <h1 className="font-semibold  stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">a</span>ugmented
            </h1>
            <h1 className="font-semibold  stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">s</span>earch
            </h1>
            <h1 className="font-semibold  stroke-white font-outline-1 md:font-outline-2">
              <span className="text-black stroke-white">for </span>
              <span className="text-orange-400 font-outline-0">p</span>eople
            </h1>
          </div>

          <div className="flex justify-center items-center relative w-screen mt-[-200px]">
            <GoogleGeminiEffect className="inset-0 w-full" />
            <a
              href="/api/auth/login"
              className="rounded-full font-semibold text-neutral-950 flex gap-2 justify-center items-center p-2 md:px-6 md:py-3 border shadow-lg text-xs md:text-xl transition-all duration-200 bg-white hover:bg-gray-100 absolute  top-52 md:top-[230px]"
            >
              join rasp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

interface CardProps {
  items: Array<[string, string, string?]>;
  className: string;
  imageClass: string;
}

const Cards: React.FC<CardProps> = ({ items, className, imageClass }) => (
  <div className="flex flex-wrap justify-center items-center gap-6">
    {items.map((item, index) => (
      <div
        key={index}
        className={`md:w-64 w-32 border border-dashed border-gray-700 flex flex-col justify-between shrink-0 overflow-hidden ${className}`}
      >
        <div className="bg-gradient-to-br from-orange-500/50 to-orange-600/80 h-full">
          <img
            src={item[1]}
            alt={item[0]}
            className={`object-cover h-full ${imageClass} w-full`}
          />
        </div>
        <div className="border border-dashed border-gray-700 px-3 py-2 lg:px-5 lg:py-4 text-center flex flex-wrap justify-center items-center gap-2">
          <p className=" text-xs md:text-sm lg:text-base font-normal leading-tight text-white">
            {item[0]}
          </p>
          {item.length === 3 && (
            <p className="text-xs md:text-sm lg:text-base font-normal leading-tight">
              <Highlight>({item[2]})</Highlight>
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Highlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <mark className="bg-gradient-to-r from-orange-500 to-orange-300  ">
      {children}
    </mark>
  );
};

// Infinite Scroll modified to change direction based on screen size

interface InfiniteScrollProps {
  direction:
    | "horizontal-left"
    | "horizontal-right"
    | "vertical-up"
    | "vertical-down";
  smallDirection:
    | "horizontal-left"
    | "horizontal-right"
    | "vertical-up"
    | "vertical-down";
  children: React.ReactNode;
  speed?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  direction,
  smallDirection,
  children,
  speed = 30,
}) => {
  const [scrollDirection, setScrollDirection] = useState(direction);
    const isVertical = true;
  const animationDirection =
    scrollDirection.endsWith("up") || scrollDirection.endsWith("left") ? -1 : 1;

  useEffect(() => {
    const handleResize = () => {
      setScrollDirection(window.innerWidth >= 768 ? smallDirection : direction);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially
    return () => window.removeEventListener("resize", handleResize);
  }, [direction, smallDirection]);

  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection:  "row", // Correct flexDirection
    justifyContent: "center",
    alignItems: "center",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isVertical ? "column" : "row", // Correct flexDirection
    gap: "30px",
    width: isVertical ? "100%" : "auto",
  };

  const animationProps = {
    x: isVertical ? 0 : `${animationDirection * 50}%`,
    y: isVertical ? `${animationDirection * 50}%` : 0,
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={contentStyle}
        animate={animationProps}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default Signin;
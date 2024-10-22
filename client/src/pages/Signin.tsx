//@ts-nocheck

"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { GoogleGeminiEffect } from "../@/components/ui/google-gemini-effect";
import React from "react";

interface GoogleAuthResponse {
  code: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
}

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
export default function Component() {
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  useEffect(() => {
    const token = getCookie("token");
    if (token && token !== "undefined") {
      navigate("/");
    }
  }, [navigate]);

  const handleGoogleAuth = async ({ code }: GoogleAuthResponse) => {
    try {
      const { data } = await axios.post<AuthResponse>(
        `${process.env.REACT_APP_SERVER_URL}/auth/google`,
        { code },
        { withCredentials: true }
      );

      const { success, message, token } = data;
      setCookie("token", token, 7);
      if (success) {
        console.log("Success");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleAuth,
    flow: "auth-code",
  });

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
          <div className="flex flex-col text-center text-transparent text-5xl  leading-tight mb-10 md:text-8xl">
            <h1 className="font-bold  stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">r</span>etrieval
            </h1>
            <h1 className="font-bold  stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">a</span>ugmented
            </h1>
            <h1 className="font-bold  stroke-white font-outline-1 md:font-outline-2 mb-2">
              <span className="text-orange-400 font-outline-0">s</span>earch
            </h1>
            <h1 className="font-bold  stroke-white font-outline-1 md:font-outline-2">
              <span className="text-black stroke-white">for </span>
              <span className="text-orange-400 font-outline-0">p</span>eople
            </h1>
          </div>

          <div className="flex justify-center items-center relative w-screen mt-[-200px]">
            <GoogleGeminiEffect className="inset-0 w-full" />
            <button
              onClick={() => handleGoogleLogin()}
              className="rounded-full text-neutral-950 flex gap-2 justify-center items-center p-2 md:px-3 md:py-3 border shadow-lg font-normal text-xs md:text-xl transition-all duration-200 bg-white hover:bg-gray-100 absolute  top-52 md:top-[230px]"
            >
              <FaGoogle className="w-5 h-5 " />
              Sign in with Google
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
const Cards = ({ items, className, imageClass }) => (
  <div className="flex flex-wrap justify-center items-center gap-6">
    {items.map((item, index) => (
      <div
        key={index}
        className={`md:w-64 w-32  border border-dashed border-gray-700 flex flex-col justify-between shrink-0 overflow-hidden ${className}`}
      >
        <div className="bg-gradient-to-br from-orange-500/50 to-orange-600/80 h-full">
          <img
            src={item[1]}
            alt={item[0]}
            className={`object-cover h-full ${imageClass} w-full`}
          />
        </div>
        <div className="border border-dashed border-gray-700 px-3 py-2 lg:px-5 lg:py-4 text-center flex justify-center items-center gap-2">
          <p className="text-base sm:text-sm lg:text-base font-semibold leading-tight text-white">
            {item[0]}
          </p>
          {item.length === 3 && (
            <p className="text-sm sm:text-xs lg:text-base font-semibold leading-tight">
              <Highlight>({item[2]})</Highlight>
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const Highlight = ({ children }) => (
  <mark className="text-orange-500 to-orange-300 bg-clip-text text-base sm:text-sm lg:text-base ">
    {children}
  </mark>
);

// Infinite Scroll modified to change direction based on screen size

const InfiniteScroll = ({
  direction,
  smallDirection,
  children,
  speed = 30,
}) => {
  const [scrollDirection, setScrollDirection] = useState(direction);
  const isVertical = scrollDirection.startsWith("vertical");
  const animationDirection =
    scrollDirection.endsWith("up") || scrollDirection.endsWith("left") ? -1 : 1;

  useEffect(() => {
    const handleResize = () => {
      setScrollDirection(window.innerWidth >= 768 ? smallDirection : direction);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially
    return () => window.removeEventListener("resize", handleResize);
  }, [direction]);

  const containerStyle = {
    overflow: "hidden",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    width: isVertical ? "100%" : "auto",
  };

  const animationProps = {
    x: 0,
    y: smallDirection
      ? `${animationDirection * 50}%`
      : `${animationDirection * -50}%`,
  };

  // Wrap children in a div with the appropriate flex direction
  const wrappedChildren = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      {React.Children.map(children, (child) => (
        <div style={{ flexShrink: 0 }}>{child}</div>
      ))}
    </div>
  );

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
        {wrappedChildren}
        {wrappedChildren}
      </motion.div>
    </div>
  );
};

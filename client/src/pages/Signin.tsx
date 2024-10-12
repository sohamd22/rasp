import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

import { FaGoogle } from "react-icons/fa";
import HeadingBig from '../components/text/HeadingBig';

const Signin: React.FC = () => {
  const { user, fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authSuccess = urlParams.get('auth');
      if (authSuccess === 'success') {
        await fetchUser();
      }
      if (user) {
        navigate('/');
      }
    };

    checkAuth();
  }, [fetchUser, user, navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  return (
    <section className="bg-black flex flex-col justify-center items-center min-h-screen">
            <div className="text-white text-left text-6xl leading-tight mb-10">
                <HeadingBig>
                    <span className="text-orange-400">r</span>etrieval
                </HeadingBig>
                <HeadingBig>
                    <span className="text-orange-400">a</span>ugmented
                </HeadingBig>
                <HeadingBig>
                    <span className="text-orange-400">s</span>earch
                </HeadingBig>
                <HeadingBig>
                    <span className="ml-[-5rem]">for </span> <span className="text-orange-400">p</span>eople
                </HeadingBig>
            </div>


            {/* Google Login Button */}
            <button 
                onClick={handleGoogleSignIn} 
                className="text-neutral-950 flex gap-2 justify-center items-center p-4 rounded-md border shadow-lg font-medium text-lg transition-all duration-200 hover:-translate-y-0.5 bg-white">
                <FaGoogle size="1.125rem"/>Google
            </button>
        </section>
  );
};

export default Signin;

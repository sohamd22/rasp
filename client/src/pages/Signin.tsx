import HeadingBig from '../components/text/HeadingBig';

const Signin: React.FC = () => {
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
        <a
            href="/api/auth/login"
            className="max-w-md text-neutral-950 flex gap-2 justify-center items-center py-4 px-8 w-fit rounded-md border shadow-lg font-semibold text-xl transition-all duration-200 hover:-translate-y-0.5 bg-white">
            join rasp
        </a>
    </section>
  );
};

export default Signin;

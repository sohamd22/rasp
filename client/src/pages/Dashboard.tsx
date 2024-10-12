const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, User!</h1>
      <a
        href={`${import.meta.env.VITE_SERVER_URL}/auth/logout`}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </a>
    </div>
  );
};

export default Dashboard;


const Dashboard = ({ username }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Bienvenido, {username}
      </header>
    </div>
  );
};

export default Dashboard;
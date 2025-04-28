import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <header className="header">
        <h1>TechTalk Hub</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/create">Create Post</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;

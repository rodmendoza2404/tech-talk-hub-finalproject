import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import PostCard from "../components/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === "All") return true;
    return post.flag === filter;
  });

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`home-page ${darkMode ? "dark" : ""}`}>
      <div className="filter-container">
        <label>Filter Posts: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Question">Questions</option>
          <option value="Opinion">Opinions</option>
        </select>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={() => setShowContent(!showContent)}>
          {showContent ? "Hide Content" : "Show Content"}
        </button>
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} darkMode={darkMode} showContent={showContent} />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default Home;

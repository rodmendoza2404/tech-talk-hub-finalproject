import { Link } from "react-router-dom";

function PostCard({ post, darkMode, showContent }) {
  return (
    <div className={`post-card ${darkMode ? "dark" : ""}`}>
      <Link to={`/post/${post.id}`}>
      <h2>
      {post.title} {post.repost_id ? <span>(Repost)</span> : ""}
      </h2>

      </Link>
      <p>{new Date(post.created_at).toLocaleString()}</p>
      <p>{post.upvotes} upvotes</p>
      <p className="user-id">Posted by: {post.user_id}</p>

      {showContent && (
        <div className="post-extra">
          {post.image_url && (
            <img src={post.image_url} alt="Post" className="post-image" />
          )}
          {post.content && <p>{post.content}</p>}
        </div>
      )}
    </div>
  );
}

export default PostCard;

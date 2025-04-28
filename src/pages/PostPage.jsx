import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getUserId } from "../utils/user";


function PostPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [newComments, setNewComments] = useState([]);  

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content || "");
      setEditImageUrl(data.image_url || "");
      setNewComments(data.comments || []);
    }
  }

  async function handleUpvote() {
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", id);

    if (error) {
      console.error("Error upvoting post:", error);
    } else {
      setPost({ ...post, upvotes: post.upvotes + 1 });
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    const updatedComments = [...(newComments || []), comment]; // 🔥 Safer spread

    const { error } = await supabase
      .from("posts")
      .update({ comments: updatedComments })
      .eq("id", id);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNewComments(updatedComments);
      setComment("");
    }
  }

  async function handleDelete() {
    const enteredKey = prompt("Enter the secret key to delete this post:");  
    if (enteredKey !== post.secret_key) {  
      alert("Unauthorized: Secret key does not match.");  
      return;
    }
    

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post:", error);
    } else {
      navigate("/");
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    const enteredKey = prompt("Enter the secret key to edit this post:"); 
    if (enteredKey !== post.secret_key) { 
      alert("Unauthorized: Secret key does not match."); 
      return;
    }

    const { error } = await supabase
      .from("posts")
      .update({
        title: editTitle,
        content: editContent,
        image_url: editImageUrl,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating post:", error);
    } else {
      setPost({
        ...post,
        title: editTitle,
        content: editContent,
        image_url: editImageUrl,
      });
      setIsEditing(false);
    }
  }
  async function handleRepost() {
    const { data, error } = await supabase.from("posts").insert([
      {
        title: post.title,
        content: post.content,
        image_url: post.image_url,
        upvotes: 0,
        comments: [],
        secret_key: "", 
        user_id: getUserId(),
        flag: post.flag,
        reference_post_id: post.id, 
      },
    ]);
  
    if (error) {
      console.error("Error reposting:", error);
    } else {
      alert("Post successfully reposted!");
      navigate("/");
    }
  }
  

  if (!post) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }
  

  return (
    <div className="post-page">
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={editImageUrl}
            onChange={(e) => setEditImageUrl(e.target.value)}
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{new Date(post.created_at).toLocaleString()}</p>
          {post.image_url && <img src={post.image_url} alt="Post" className="post-image" />}
          <p>{post.content}</p>

          <div className="post-actions">
            <button onClick={handleUpvote}>👍 Upvote ({post.upvotes})</button>
            <button onClick={() => setIsEditing(true)}>✏️ Edit Post</button>
            <button onClick={handleDelete}>🗑️ Delete Post</button>
            <button onClick={handleRepost}>🔁 Repost</button>
          </div>

          <h3>Comments</h3>
          <ul>
            {(newComments || []).map((c, index) => (
              <li key={index}>{c}</li>
            ))}
          </ul>

          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Post Comment</button>
          </form>
        </>
      )}
    </div>
  );
}

export default PostPage;

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/user";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [secretKey, setSecretKey] = useState("");
  const [flag, setFlag] = useState("Question");
  const [imageMode, setImageMode] = useState("upload");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    let imageUrlToSave = "";

    if (imageMode === "upload" && file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      imageUrlToSave = publicUrlData.publicUrl;
    } else if (imageMode === "url" && imageUrl) {
      imageUrlToSave = imageUrl;
    }

    const { data, error } = await supabase.from("posts").insert([
      {
        title,
        content,
        image_url: imageUrlToSave,
        secret_key: secretKey,
        upvotes: 0,
        comments: [],
        user_id: getUserId(),
        flag: flag,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="form-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <select value={imageMode} onChange={(e) => setImageMode(e.target.value)}>
          <option value="upload">Upload from Computer</option>
          <option value="url">Paste Image URL</option>
        </select>
        {imageMode === "upload" ? (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        ) : (
          <input
            type="text"
            placeholder="Paste Image URL here"
            value={imageUrl || ""}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Set a Secret Key (required to edit/delete)"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <select value={flag} onChange={(e) => setFlag(e.target.value)} required>
          <option value="Question">Question</option>
          <option value="Opinion">Opinion</option>
        </select>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;

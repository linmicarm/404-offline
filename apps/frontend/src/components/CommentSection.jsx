import { useState, useEffect } from "react";
import { getComments, createComment, deleteComment } from "../api/index.js";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({ name }) {
  return (
    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--peach-light)", border: "1.5px solid var(--peach)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "12px", fontWeight: "700", color: "var(--peach-dark)", flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ReplyForm({ sideQuestId, parentId, authorName, setAuthorName, onSubmit, onCancel, showToast }) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!authorName.trim() || !body.trim()) {
      setError("Name and reply are required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createComment(sideQuestId, {
        author_name: authorName.trim(),
        body: body.trim(),
        parent_id: parentId,
      });
      localStorage.setItem("comment-name", authorName.trim());
      onSubmit(result.data);
      setBody("");
      onCancel();
      showToast("Reply posted! ✓");
    } catch (err) {
      setError("Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px", marginLeft: "42px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        className="form-input"
        style={{ maxWidth: "240px" }}
        placeholder="Your name or handle..."
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        maxLength={50}
      />
      <textarea
        className="form-input"
        placeholder="Write a reply..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={500}
        style={{ resize: "vertical" }}
      />
      <div className="mono" style={{ fontSize: "10px", color: body.length >= 450 ? "#991B1B" : "var(--ink-3)", textAlign: "right" }}>
        {body.length}/500
      </div>
      {error && <div className="mono" style={{ fontSize: "11px", color: "#991B1B" }}>{error}</div>}
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn-primary" type="submit" disabled={submitting} style={{ fontSize: "10px", padding: "6px 14px" }}>
          {submitting ? "Posting..." : "Reply"}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel} style={{ fontSize: "10px", padding: "6px 14px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function CommentCard({ comment, sideQuestId, authorName, setAuthorName, onDelete, onReplyAdded, showToast }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="card" style={{ cursor: "default" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={comment.author_name} />
          <div>
            <div style={{ fontWeight: "700", fontSize: "13px", color: "var(--ink)" }}>{comment.author_name}</div>
            <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)" }}>{formatDate(comment.created_at)}</div>
          </div>
        </div>
        <button onClick={() => onDelete(comment.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: "12px", padding: "0", fontFamily: "'Space Mono', monospace" }}>✕</button>
      </div>

      <div style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.6", paddingLeft: "42px", marginBottom: "10px" }}>
        {comment.body}
      </div>

      <div style={{ paddingLeft: "42px" }}>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "var(--ink-3)", padding: "0" }}
        >
          {showReplyForm ? "Cancel" : `↩ Reply${comment.replies?.length > 0 ? ` · ${comment.replies.length}` : ""}`}
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "12px", marginLeft: "42px", display: "flex", flexDirection: "column", gap: "8px", borderLeft: "2px solid var(--border)", paddingLeft: "12px" }}>
          {comment.replies.map((reply) => (
            <div key={reply.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Avatar name={reply.author_name} />
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "12px", color: "var(--ink)" }}>{reply.author_name}</div>
                    <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)" }}>{formatDate(reply.created_at)}</div>
                  </div>
                </div>
                <button onClick={() => onDelete(reply.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: "11px", padding: "0", fontFamily: "'Space Mono', monospace" }}>✕</button>
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-2)", lineHeight: "1.6", paddingLeft: "40px" }}>
                {reply.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReplyForm && (
        <ReplyForm
          sideQuestId={sideQuestId}
          parentId={comment.id}
          authorName={authorName}
          setAuthorName={setAuthorName}
          onSubmit={(reply) => {
            onReplyAdded(comment.id, reply);
            setShowReplyForm(false);
          }}
          onCancel={() => setShowReplyForm(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
}

export default function CommentSection({ sideQuestId, showToast }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState(localStorage.getItem("comment-name") || "");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [sideQuestId]);

  async function fetchComments() {
    try {
      const data = await getComments(sideQuestId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!authorName.trim() || !body.trim()) {
      setError("Name and comment are required.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createComment(sideQuestId, {
        author_name: authorName.trim(),
        body: body.trim(),
      });
      localStorage.setItem("comment-name", authorName.trim());
      setComments([...comments, { ...result.data, replies: [] }]);
      setBody("");
      showToast("Comment posted! ✓");
    } catch (err) {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteComment(id);
      setComments(comments
        .filter((c) => c.id !== id)
        .map((c) => ({ ...c, replies: c.replies?.filter((r) => r.id !== id) || [] }))
      );
      showToast("Deleted.", "info");
    } catch (err) {
      showToast("Failed to delete.", "error");
    }
  }

  function handleReplyAdded(parentId, reply) {
    setComments(comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : c
    ));
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <div className="section-label">Discussion ({comments.length})</div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            className="form-input"
            style={{ maxWidth: "280px" }}
            placeholder="Your name or handle..."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={50}
          />
          <textarea
            className="form-input"
            placeholder="Are you going? Any tips? Questions welcome..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={500}
            style={{ resize: "vertical", width: "100%" }}
          />
          <div className="mono" style={{ fontSize: "10px", color: body.length >= 450 ? "#991B1B" : "var(--ink-3)", textAlign: "right" }}>
            {body.length}/500
          </div>
          {error && <div className="mono" style={{ fontSize: "11px", color: "#991B1B" }}>{error}</div>}
          <div>
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </div>
      </form>

      {loading && <div className="loading">Loading comments... 🍑</div>}

      {!loading && comments.length === 0 && (
        <div className="empty">No comments yet — be the first to say something!</div>
      )}

      {!loading && comments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              sideQuestId={sideQuestId}
              authorName={authorName}
              setAuthorName={setAuthorName}
              onDelete={handleDelete}
              onReplyAdded={handleReplyAdded}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
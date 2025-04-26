import { useState, useCallback } from "react";
import { Comment } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";

export function useComments() {
  const authFetch = useAuthFetch();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const fetchComments = useCallback(
    async (postId: string) => {
      try {
        const res = await authFetch(`/api/post/${postId}/comments`);
        const data = await res.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    [authFetch]
  );

  const submitComment = useCallback(
    async (postId: string) => {
      if (!commentText.trim()) return;
      try {
        const res = await authFetch(`/api/post/${postId}/comment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: commentText }),
        });
        const data = await res.json();
        setComments((prev) => [data.comment, ...prev]);
        setCommentText("");
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    },
    [authFetch, commentText]
  );

  return {
    comments,
    commentText,
    setCommentText,
    fetchComments,
    submitComment,
  };
}

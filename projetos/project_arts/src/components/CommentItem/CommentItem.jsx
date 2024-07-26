import React, { useState } from 'react';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import './CommentItem.css';

function CommentItem({ comment, postId }) {
    const { currentUser } = useAuth();
    const [reply, setReply] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [error, setError] = useState(null);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (reply.trim() === '') return;

        const db = getDatabase();
        const commentsRef = ref(db, `comments/${postId}`);

        const newReplyData = {
            text: reply,
            userId: currentUser.uid,
            userName: currentUser.displayName,
            createdAt: serverTimestamp(),
            parentId: comment.id,
        };

        push(commentsRef, newReplyData)
            .then(() => {
                setReply('');
                setShowReply(false);
            })
            .catch((error) => {
                setError('Erro ao enviar resposta');
                console.error(error);
            });
    };

    return (
        <div className="comment-item">
            <p className="comment-user">{comment.userName}</p>
            <p className="comment-text">{comment.text}</p>
            <p className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
            </p>
            <button onClick={() => setShowReply(!showReply)} className="reply-button">
                Responder
            </button>
            {showReply && (
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Escreva uma resposta..."
                        className="reply-input"
                    />
                    <button type="submit" className="submit-button">Responder</button>
                    {error && <p className="error">{error}</p>}
                </form>
            )}
            <div className="replies-list">
                {comment.replies && comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} postId={postId} />
                ))}
            </div>
        </div>
    );
}

export default CommentItem;

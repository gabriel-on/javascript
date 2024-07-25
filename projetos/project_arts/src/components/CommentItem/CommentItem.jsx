// src/components/CommentItem/CommentItem.js
import React, { useState } from 'react';
import { getDatabase, ref, set, push } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import './CommentItem.css';

function CommentItem({ postId, commentId, comment }) {
    const [reply, setReply] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || 'Usuário Anônimo';

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        const db = getDatabase();
        const repliesRef = ref(db, `posts/${postId}/comments/${commentId}/replies`);
        const newReplyRef = push(repliesRef);

        set(newReplyRef, {
            userName,
            text: reply,
            date: new Date().toISOString(),
        }).then(() => {
            setReply('');
            setShowReplyForm(false);
        }).catch((error) => {
            console.error('Erro ao adicionar resposta', error);
        });
    };

    return (
        <div className="comment-item">
            <div className="comment-avatar"></div>
            <div className="comment-content">
                <p className="comment-user">{comment.userName}</p>
                <p className="comment-text">{comment.text}</p>
                <p className="comment-date">{new Date(comment.date).toLocaleString()}</p>
                <button onClick={() => setShowReplyForm(!showReplyForm)} className="comment-reply-button">Responder</button>
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="reply-form">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Adicione uma resposta..."
                            required
                        />
                        <button type="submit">Responder</button>
                    </form>
                )}
                {comment.replies && (
                    <div className="replies-list">
                        {Object.entries(comment.replies).map(([replyId, reply]) => (
                            <CommentItem
                                key={replyId}
                                postId={postId}
                                commentId={replyId}
                                comment={reply}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentItem;

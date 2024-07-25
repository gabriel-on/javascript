// src/components/CommentItem/CommentItem.js
import React, { useState } from 'react';
import { getDatabase, ref, set, push } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import './CommentItem.css';

function CommentItem({ postId, commentId, comment, replies }) {
    const [reply, setReply] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || 'Usuário Anônimo';

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        const db = getDatabase();
        const commentsRef = ref(db, `posts/${postId}/comments/${commentId}/replies`);
        const newReplyRef = push(commentsRef);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date) ? 'Data Inválida' : date.toLocaleString();
    };

    return (
        <div className="comment-item">
            <div className="comment-avatar"></div>
            <div className="comment-content">
                <p className="comment-user">{comment.userName}</p>
                <p className="comment-text">{comment.text}</p>
                <p className="comment-date">{formatDate(comment.date)}</p>
                <button onClick={() => setShowReplyForm(!showReplyForm)} className="comment-reply-button">Responder</button>
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="reply-form">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder={`Respondendo a ${comment.userName}`}
                            required
                        />
                        <button type="submit">Responder</button>
                    </form>
                )}
                {replies && (
                    <div className="replies-list">
                        {Object.entries(replies).map(([replyId, reply]) => (
                            <div key={replyId} className="reply-item">
                                <div className="reply-avatar"></div>
                                <div className="reply-content">
                                    <p className="comment-reply-to">Respondendo a {comment.userName}</p>
                                    <p className="comment-user">{reply.userName}</p>
                                    <p className="comment-text">{reply.text}</p>
                                    <p className="comment-date">{formatDate(reply.date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentItem;

// src/components/CommentSection/CommentSection.js
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import CommentItem from '../CommentItem/CommentItem';
import './CommentSection.css';

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const userName = currentUser?.displayName || 'Usuário Anônimo';

    useEffect(() => {
        const db = getDatabase();
        const commentsRef = ref(db, `posts/${postId}/comments`);

        const unsubscribe = onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setComments(data);
            } else {
                setComments([]);
            }
        });

        return () => unsubscribe();
    }, [postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const db = getDatabase();
        const commentsRef = ref(db, `posts/${postId}/comments`);
        const newCommentRef = push(commentsRef);

        set(newCommentRef, {
            userName,
            text: newComment,
            date: new Date().toISOString(),
        }).then(() => {
            setNewComment('');
        }).catch((error) => {
            console.error('Erro ao adicionar comentário', error);
        });
    };

    return (
        <div className="comment-section">
            <h2>Comentários</h2>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    required
                />
                <button type="submit">Comentar</button>
            </form>
            <div className="comments-list">
                {Object.entries(comments).map(([commentId, comment]) => (
                    <CommentItem
                        key={commentId}
                        postId={postId}
                        commentId={commentId}
                        comment={comment}
                        replies={comment.replies}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentSection;

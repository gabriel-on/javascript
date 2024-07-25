import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication'; // Hook para autenticação
import './CommentSection.css';

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();

    // Obtém o nome de usuário do usuário autenticado
    const userName = currentUser?.displayName || 'Usuário Anônimo';

    useEffect(() => {
        const db = getDatabase();
        const commentsRef = ref(db, `posts/${postId}/comments`);

        // Listener para os comentários
        const unsubscribe = onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setComments(Object.values(data));
            } else {
                setComments([]);
            }
        });

        return () => unsubscribe();
    }, [postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Não envia se o comentário estiver vazio

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
                {comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                        <p className="comment-user">{comment.userName}</p>
                        <p className="comment-text">{comment.text}</p>
                        <p className="comment-date">{new Date(comment.date).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;

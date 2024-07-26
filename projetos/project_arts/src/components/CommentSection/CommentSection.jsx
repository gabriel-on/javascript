import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import Comment from '../Comment/Comment';
import './CommentSection.css'; // Importando CSS

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState({});
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

    // UseEffect para buscar comentários e usuários
    useEffect(() => {
        const commentsRef = ref(db, 'comments');
        const usersRef = ref(db, 'users');

        // Buscar todos os comentários
        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            setComments(data || {});
        });

        // Buscar todos os usuários
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data || {});
        });
    }, [db]);

    // Função para adicionar um novo comentário
    const handleAddComment = async (content, parentId = null) => {
        if (content.trim() === '' || !currentUser) return;

        const commentsRef = ref(db, `comments/${postId}`);
        try {
            await push(commentsRef, {
                content: content,
                userId: currentUser.uid,
                timestamp: Date.now(),
                parentId: parentId,
            });
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // Filtrando apenas os comentários do post atual
    const getTopLevelComments = () => {
        return Object.keys(comments[postId] || {})
            .filter((key) => !comments[postId][key].parentId)
            .map((key) => ({ id: key, ...comments[postId][key] }));
    };

    return (
        <div className="comment-section">
            <h2>Comentarios (Ainda Em Teste)</h2>
            <div className="new-comment">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button onClick={() => handleAddComment(newComment)}>Post Comment</button>
            </div>
            <div className="comments">
                {getTopLevelComments().map((commentData) => (
                    <Comment
                        key={commentData.id}
                        commentId={commentData.id}
                        commentData={commentData}
                        users={users}
                        comments={comments[postId] || {}} // Passando apenas os comentários do post atual
                        onReply={handleAddComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

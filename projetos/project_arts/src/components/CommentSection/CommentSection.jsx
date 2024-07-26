import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import Comment from '../Comment/Comment';
import './CommentSection.css'; // Importando CSS

const CommentSection = () => {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState({});
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

    // UseEffect para buscar comentários e usuários
    useEffect(() => {
        const commentsRef = ref(db, 'comments');
        const usersRef = ref(db, 'users');

        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            setComments(data || {});
        });

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data || {});
        });
    }, [db]);

    // Função para adicionar um novo comentário
    const handleAddComment = async (content, parentId = null) => {
        if (content.trim() === '' || !currentUser) return;
        const commentsRef = ref(db, 'comments');
        await push(commentsRef, {
            content: content,
            userId: currentUser.uid,
            timestamp: Date.now(),
            parentId: parentId,
        });
        setNewComment('');
    };

    // Filtrando apenas os comentários principais
    const getTopLevelComments = () => {
        return Object.keys(comments)
            .filter((key) => !comments[key].parentId)
            .map((key) => ({ id: key, ...comments[key] }));
    };

    return (
        <div className="comment-section">
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
                        comments={comments}
                        onReply={handleAddComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import Comment from '../Comment/Comment';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState({});
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

    useEffect(() => {
        const commentsRef = ref(db, `comments/${postId}`);
        const usersRef = ref(db, 'users');

        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            setComments(data || {});
        });

        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data || {});
        });
    }, [db, postId]);

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
            console.error("Erro ao adicionar comentário:", error);
        }
    };

    const handleUpdateComment = async (commentId, updatedContent) => {
        if (updatedContent.trim() === '') return;
        const commentRef = ref(db, `comments/${postId}/${commentId}`);
        try {
            await update(commentRef, { content: updatedContent });
        } catch (error) {
            console.error("Erro ao atualizar comentário:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const commentRef = ref(db, `comments/${postId}/${commentId}`);
        try {
            await remove(commentRef);
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        }
    };

    const getTopLevelComments = () => {
        return Object.keys(comments)
            .filter((key) => !comments[key].parentId)
            .map((key) => ({ id: key, ...comments[key] }));
    };

    return (
        <div className="comment-section">
            <h2>Comentários</h2>
            <div className="new-comment">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicionar um Comentário..."
                />
                <button onClick={() => handleAddComment(newComment)}>Postar Comentário</button>
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
                        onUpdate={handleUpdateComment}
                        onDelete={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

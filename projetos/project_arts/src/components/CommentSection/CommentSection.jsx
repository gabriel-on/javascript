import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import Comment from '../Comment/Comment';

const CommentSection = () => {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState({});
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

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

    const handleAddComment = async (content, parentId = null, replyingUserId = null) => {
        if (content.trim() === '' || !currentUser) return;
        const commentsRef = ref(db, 'comments');
        await push(commentsRef, {
            content: content,
            userId: currentUser.uid,
            timestamp: Date.now(),
            parentId: parentId, // ID do comentário pai
            replyingUserId: replyingUserId, // ID do usuário que está sendo respondido
        });
        setNewComment('');
    };

    const getTopLevelComments = () => {
        // Filtra apenas os comentários de nível superior (sem parentId)
        return Object.keys(comments)
            .filter((key) => !comments[key].parentId)
            .map((key) => ({ id: key, ...comments[key] })); // Incluindo ID no objeto
    };

    return (
        <div>
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button onClick={() => handleAddComment(newComment, null)}>Post Comment</button>
            </div>
            <div>
                {getTopLevelComments().map((commentData) => (
                    <Comment
                        key={commentData.id} // Usar o ID do comentário
                        commentId={commentData.id}
                        commentData={commentData}
                        users={users}
                        comments={comments} // Passando comments para o Comment
                        onReply={handleAddComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

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
                {Object.keys(comments).map((key) => (
                    <Comment
                        key={key}
                        commentId={key}
                        commentData={comments[key]}
                        users={users}
                        onReply={handleAddComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

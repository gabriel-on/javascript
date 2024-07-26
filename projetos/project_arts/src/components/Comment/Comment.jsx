import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';

const Comment = ({ commentId, commentData, users }) => {
    const [newReply, setNewReply] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

    const handleAddReply = async () => {
        if (newReply.trim() === '' || !currentUser) return;
        const repliesRef = ref(db, `comments/${commentId}/replies`);
        await push(repliesRef, {
            content: newReply,
            userId: currentUser.uid,
            timestamp: Date.now(),
        });
        setNewReply('');
    };

    const getUserMention = (userId) => {
        return users[userId]?.mentionName || 'Unknown User';
    };

    return (
        <div>
            <div>
                <p>{commentData.content}</p>
                <p>
                    By: {getUserMention(commentData.userId)} at {new Date(commentData.timestamp).toLocaleString()}
                </p>
            </div>
            <div>
                {commentData.replies && Object.keys(commentData.replies).map((key) => (
                    <Comment key={key} commentId={key} commentData={commentData.replies[key]} users={users} />
                ))}
            </div>
            <div>
                <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Add a reply..."
                />
                <button onClick={handleAddReply}>Post Reply</button>
            </div>
        </div>
    );
};

export default Comment;

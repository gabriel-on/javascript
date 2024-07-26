import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import './Comment.css';

const Comment = ({ commentId, commentData, users, onReply }) => {
    const [newReply, setNewReply] = useState('');
    const { currentUser } = useAuth();

    const handleAddReply = async () => {
        if (newReply.trim() === '' || !currentUser) return;
        await onReply(newReply, commentId, commentData.userId); // Passando o userId do comentário
        setNewReply('');
    };

    const getUserMention = (userId) => {
        return users[userId]?.mentionName || 'Unknown User';
    };

    return (
        <div style={{ marginLeft: commentData.parentId ? '40px' : '0' }}> {/* Indentação */}
            <div>
                <p>{commentData.content}</p>
                <p>
                    By: {getUserMention(commentData.userId)} at {new Date(commentData.timestamp).toLocaleString()}
                </p>
                {commentData.replyingUserId && (
                    <p>Replying to: {getUserMention(commentData.replyingUserId)}</p>
                )}
            </div>
            {/* Renderiza apenas um nível de respostas */}
            {commentData.parentId === null && commentData.replies && (
                <div>
                    {Object.keys(commentData.replies).map((key) => (
                        <Comment
                            key={key}
                            commentId={key}
                            commentData={commentData.replies[key]}
                            users={users}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
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

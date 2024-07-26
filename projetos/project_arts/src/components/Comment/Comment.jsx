import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import './Comment.css';

const Comment = ({ commentId, commentData, users, comments, onReply }) => {
    const [newReply, setNewReply] = useState('');
    const { currentUser } = useAuth();

    // Função para adicionar uma nova resposta
    const handleAddReply = async () => {
        if (newReply.trim() === '' || !currentUser) return;
        await onReply(newReply, commentId); // Passando ID do comentário pai
        setNewReply('');
    };

    const getUserMention = (userId) => {
        return users[userId]?.mentionName || 'Unknown User';
    };

    return (
        <div className="comment">
            <div className="comment-content">
                <p>{commentData.content}</p>
                <p>
                    By: {getUserMention(commentData.userId)} at {new Date(commentData.timestamp).toLocaleString()}
                </p>
            </div>
            <div className="reply-container">
                <div className="reply-input">
                    <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Add a reply..."
                    />
                    <button onClick={handleAddReply}>Post Reply</button>
                </div>
                <div className="replies">
                    {Object.keys(comments).map((key) => {
                        const replyData = comments[key];
                        if (replyData.parentId === commentId) { // Verificando se é resposta
                            return (
                                <Comment
                                    key={key}
                                    commentId={key}
                                    commentData={replyData}
                                    users={users}
                                    comments={comments}
                                    onReply={onReply}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default Comment;

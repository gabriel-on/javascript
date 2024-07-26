import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import './Comment.css';

const Comment = ({ commentId, commentData, users, comments, onReply }) => {
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
        <div style={{ marginLeft: commentData.parentId ? '40px' : '0' }}>
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
            {Object.keys(comments).map((key) => {
                const replyData = comments[key];
                if (replyData.parentId === commentId) { // Verifica se a resposta pertence ao comentário
                    return (
                        <Comment
                            key={key}
                            commentId={key}
                            commentData={replyData}
                            users={users}
                            comments={comments} // Passando comments para a resposta
                            onReply={onReply}
                        />
                    );
                }
                return null;
            })}
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

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import Modal from '../Modal/Modal';
import './Comment.css';

const Comment = ({ commentId, commentData, users, comments, onReply, onUpdate, onDelete }) => {
    const [newReply, setNewReply] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentUser } = useAuth();

    const handleAddReply = async () => {
        if (newReply.trim() === '' || !currentUser) return;
        await onReply(newReply, commentId);
        setNewReply('');
        setShowReplies(true);
        setShowReplyInput(false);
    };

    const getUserMention = (userId) => {
        return users[userId]?.mentionName || 'Usuário Anônimo';
    };

    const toggleReplies = () => {
        setShowReplies((prev) => !prev);
    };

    const hasReplies = Object.keys(comments).some((key) => comments[key].parentId === commentId);

    return (
        <div className="comment">
            <div className="comment-content">
                <p>{commentData.content}</p>
                <p>
                    By: {getUserMention(commentData.userId)} at {new Date(commentData.timestamp).toLocaleString()}
                </p>
                {currentUser && currentUser.uid === commentData.userId && (
                    <div>
                        <button onClick={() => setIsModalOpen(true)}>Editar</button>
                    </div>
                )}
            </div>
            <div className="reply-container">
                {!showReplyInput && (
                    <button onClick={() => setShowReplyInput(true)}>Responder</button>
                )}
                {showReplyInput && (
                    <div className="reply-input">
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Adicionar Resposta..."
                        />
                        <button onClick={handleAddReply}>Postar Resposta</button>
                        <button onClick={() => setShowReplyInput(false)}>Cancelar</button>
                    </div>
                )}
                {hasReplies && (
                    <button onClick={toggleReplies}>
                        {showReplies ? 'Ocultar Respostas' : 'Ver Respostas'}
                    </button>
                )}
                {showReplies && (
                    <div className="replies">
                        {Object.keys(comments).map((key) => {
                            const replyData = comments[key];
                            if (replyData.parentId === commentId) {
                                return (
                                    <Comment
                                        key={key}
                                        commentId={key}
                                        commentData={replyData}
                                        users={users}
                                        comments={comments}
                                        onReply={onReply}
                                        onUpdate={onUpdate}
                                        onDelete={onDelete}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                commentData={{ ...commentData, id: commentId }}
                onUpdate={onUpdate}
                onDelete={onDelete}
                currentUser={currentUser}
            />
        </div>
    );
};

export default Comment;

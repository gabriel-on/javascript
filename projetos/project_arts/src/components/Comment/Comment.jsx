import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuthentication';
import './Comment.css';

const Comment = ({ commentId, commentData, users, comments, onReply }) => {
    const [newReply, setNewReply] = useState('');
    const [showReplies, setShowReplies] = useState(false); // Estado para controlar a visibilidade das respostas
    const [showReplyInput, setShowReplyInput] = useState(false); // Estado para controlar a visibilidade do campo de resposta
    const { currentUser } = useAuth();

    // Função para adicionar uma nova resposta
    const handleAddReply = async () => {
        if (newReply.trim() === '' || !currentUser) return;
        await onReply(newReply, commentId);
        setNewReply('');
        setShowReplies(true); // Expande automaticamente as respostas após adicionar uma nova resposta
        setShowReplyInput(false); // Oculta o campo de resposta após o envio
    };

    const getUserMention = (userId) => {
        return users[userId]?.mentionName || 'Usuário Anônimo';
    };

    // Função para alternar a visibilidade de todas as respostas
    const toggleReplies = () => {
        setShowReplies((prev) => !prev);
    };

    // Verificando se o comentário tem respostas
    const hasReplies = Object.keys(comments).some((key) => comments[key].parentId === commentId);

    return (
        <div className="comment">
            <div className="comment-content">
                <p>{commentData.content}</p>
                <p>
                    By: {getUserMention(commentData.userId)} at {new Date(commentData.timestamp).toLocaleString()}
                </p>
            </div>
            <div className="reply-container">
                {/* Botão para mostrar o campo de resposta */}
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
                {/* Renderiza o botão apenas se houver respostas */}
                {hasReplies && (
                    <button onClick={toggleReplies}>
                        {showReplies ? 'Ocultar Respostas' : 'Ver Resposts'}
                    </button>
                )}
                {showReplies && (
                    <div className="replies">
                        {Object.keys(comments).map((key) => {
                            const replyData = comments[key];
                            if (replyData.parentId === commentId) { // Verifica se a resposta pertence ao comentário
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
                )}
            </div>
        </div>
    );
};

export default Comment;

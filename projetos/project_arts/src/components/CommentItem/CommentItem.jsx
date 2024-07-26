import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import './CommentItem.css';

function CommentItem({ comment, postId, mentionedUsers }) {
    const { currentUser } = useAuth();
    const [reply, setReply] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (reply.trim() === '') return;

        const db = getDatabase();
        const commentsRef = ref(db, `comments/${postId}`);

        const newReplyData = {
            text: reply,
            userId: currentUser.uid,
            userName: currentUser.displayName,
            createdAt: serverTimestamp(),
            parentId: comment.id,
        };

        push(commentsRef, newReplyData)
            .then(() => {
                setReply('');
                setShowReply(false);
            })
            .catch((error) => {
                setError('Erro ao enviar resposta');
                console.error(error);
            });
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setReply(value);

        // Encontrar menções
        const mentionRegex = /@(\w*)$/; // Regex para capturar menções
        const match = value.match(mentionRegex);

        if (match) {
            const searchTerm = match[1].toLowerCase();
            const filteredUsers = mentionedUsers.filter(user =>
                user.displayName.toLowerCase().includes(searchTerm)
            );
            setSuggestions(filteredUsers);
        } else {
            setSuggestions([]);
        }
    };

    const selectUser = (user) => {
        const mentionRegex = /@(\w*)$/; // Regex para encontrar a posição da última menção
        const currentValue = reply;
        const mentionIndex = currentValue.search(mentionRegex);

        const newText = currentValue.substring(0, mentionIndex) + `@${user.displayName} ` + currentValue.substring(mentionIndex + user.displayName.length + 1);
        setReply(newText);
        setSuggestions([]);
    };

    const handleReplyToggle = () => {
        setShowReply(!showReply);
        // Preencher automaticamente o campo de resposta com o nome do usuário
        if (!showReply) {
            setReply(`@${comment.userName} `);
        } else {
            setReply('');
        }
    };

    return (
        <div className="comment-item">
            <p className="comment-user">{comment.userName}</p>
            <p className="comment-text">{comment.text}</p>
            <p className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
            </p>
            <button onClick={handleReplyToggle} className="reply-button">
                Responder
            </button>
            {showReply && (
                <form onSubmit={handleReplySubmit} className="reply-form">
                    <textarea
                        value={reply}
                        onChange={handleInputChange}
                        placeholder="Escreva uma resposta..."
                        className="reply-input"
                    />
                    <button type="submit" className="submit-button">Responder</button>
                    {error && <p className="error">{error}</p>}
                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map(user => (
                                <li key={user.id} onClick={() => selectUser(user)}>{user.displayName}</li>
                            ))}
                        </ul>
                    )}
                </form>
            )}
            <div className="replies-list">
                {comment.replies && comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} postId={postId} mentionedUsers={mentionedUsers} />
                ))}
            </div>
        </div>
    );
}

export default CommentItem;

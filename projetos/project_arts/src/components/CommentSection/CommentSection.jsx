import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { useAuth } from '../../hooks/useAuthentication';
import Comment from '../Comment/Comment';
import './CommentSection.css'; // Importando CSS

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState({});
    const [users, setUsers] = useState({});
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuth();
    const db = getDatabase();

    // UseEffect para buscar comentários e usuários
    useEffect(() => {
        const commentsRef = ref(db, 'comments');
        const usersRef = ref(db, 'users');

        // Buscar todos os comentários
        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            setComments(data || {});
        });

        // Buscar todos os usuários
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data || {});
        });
    }, [db]);

    // Função para adicionar um novo comentário
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
            console.error("Error adding comment:", error);
        }
    };

    // Filtrando apenas os comentários do post atual
    const getTopLevelComments = () => {
        return Object.keys(comments[postId] || {})
            .filter((key) => !comments[postId][key].parentId)
            .map((key) => ({ id: key, ...comments[postId][key] }));
    };

    // Edição e Exclusão
    const handleUpdateComment = async (commentId, updatedContent) => {
        if (updatedContent.trim() === '') return; // Adicione validação para não atualizar com conteúdo vazio
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

    return (
        <div className="comment-section">
            <h2>Comentários (Em desenvolvimento, portanto pode conter erros.)</h2>
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
                        comments={comments[postId] || {}}
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

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile as updateProfileAuth,
    signOut,
} from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { getUnixTime } from 'date-fns';

export const useAuth = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const auth = getAuth();
    const db = getDatabase();
    const isMounted = useRef(true);

    const handleCancellation = () => {
        if (!isMounted.current) {
            throw new Error("Operação cancelada");
        }
    };

    const createUser = async (data) => {
        handleCancellation();
        setLoading(true);

        try {
            // Verificação de admin
            data.isAdmin =
                data.email === 'black@gmail.com' ||
                data.email === 'black1@gmail.com' ||
                data.email === 'black2@gmail.com';

            // Verificar se o mentionName já existe
            const mentionNameRef = ref(db, 'users');
            const snapshot = await get(mentionNameRef);
            let mentionNameExists = false;

            if (snapshot.exists()) {
                const users = snapshot.val();
                for (const key in users) {
                    if (users[key].mentionName === data.mentionName) {
                        mentionNameExists = true;
                        break;
                    }
                }
            }

            if (mentionNameExists) {
                setLoading(false);
                setError('O nome de menção já está em uso. Escolha outro.');
                return;
            }

            const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfileAuth(user, { displayName: data.displayName });

            const joinedAt = getUnixTime(new Date());

            // Criar um documento para o usuário
            const dbRef = ref(db, `users/${user.uid}`);
            await set(dbRef, {
                email: data.email,
                displayName: data.displayName,
                mentionName: data.mentionName,
                isAdmin: data.isAdmin || false,
                joinedAt: joinedAt,
            });

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: data.displayName,
                mentionName: data.mentionName,
                isAdmin: data.isAdmin || false,
            });

            setLoading(false);
            return user;
        } catch (error) {
            let systemErrorMessage;

            if (error.code === "auth/weak-password") {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.code === "auth/email-already-in-use") {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }

            setLoading(false);
            setError(systemErrorMessage);
        }
    };

    const logout = async () => {
        handleCancellation();
        setLoading(true);

        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        handleCancellation();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = auth.currentUser;

            // Carregar dados do usuário do Realtime Database
            const userRef = ref(db, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            if (userData) {
                // Atualizar o estado do usuário atual
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: userData.displayName,
                    mentionName: userData.mentionName,
                    isAdmin: userData.isAdmin || false,
                });
            } else {
                setError("Dados do usuário não encontrados.");
            }
        } catch (error) {
            let systemErrorMessage;

            if (error.message) {
                systemErrorMessage = "E-mail inválido ou Senha incorreta";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }

            setError(systemErrorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Carregar dados do usuário do Realtime Database
                const userRef = ref(db, `users/${user.uid}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val();

                if (userData) {
                    setCurrentUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: userData.displayName,
                        mentionName: userData.mentionName,
                        isAdmin: userData.isAdmin || false,
                    });
                } else {
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, [auth, db]);

    const getCurrentUser = () => {
        return auth.currentUser;
    };

    return {
        auth,
        createUser,
        error,
        logout,
        login,
        loading,
        currentUser,
        setCurrentUser,
        getCurrentUser
    };
};

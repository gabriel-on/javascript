import { useState, useEffect, useRef } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile as updateProfileAuth, signOut } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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

    const createUser = async (userData) => {
        handleCancellation();
        setLoading(true);

        try {
            if (!userData) {
                throw new Error("Dados de usuário não fornecidos.");
            }

            const isAdmin = userData.email === "admin@example.com"; // Verificação simplificada para isAdmin

            const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

            await updateProfileAuth(user, { displayName: userData.displayName });

            const joinedAt = Date.now();

            const dbUserRef = ref(db, `users/${user.uid}`);
            await set(dbUserRef, {
                email: userData.email,
                displayName: userData.displayName,
                isAdmin: isAdmin || false,
                joinedAt: joinedAt,
            });

            const dbUserDetailsRef = ref(db, `userDetails/${user.uid}`); // Criar nó "userDetails" para cada usuário
            await set(dbUserDetailsRef, {
                registrationDate: joinedAt,
                // Adicione outras informações adicionais conforme necessário
            });

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: userData.displayName,
                isAdmin: isAdmin || false,
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

    const login = async (userData) => {
        handleCancellation();
        setLoading(true);
        setError(false);

        try {
            await signInWithEmailAndPassword(auth, userData.email, userData.password);

            const user = auth.currentUser;

            await updateProfileAuth(user, { displayName: user.displayName });

            setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAdmin: userData.isAdmin || false,
            });
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

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(
                user
                    ? {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                    }
                    : null
            );
        });

        return () => {
            isMounted.current = false;
            unsubscribe();
        };
    }, [auth]);

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
        getCurrentUser
    };
};

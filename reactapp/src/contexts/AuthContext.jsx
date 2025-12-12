import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("jwt_token"));
    const [id, setId] = useState(parseInt(localStorage.getItem("id")) || null);
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const [name, setName] = useState(localStorage.getItem("name"));
    const [level, setLevel] = useState(parseInt(localStorage.getItem("level")) || 0);

    const login = (token, id, username, name, level) => {
        const parsedId = parseInt(id);
        const parsedLevel = parseInt(level);
        setToken(token);
        setId(parsedId);
        setUsername(username);
        setName(name);
        setLevel(parsedLevel);
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("id", parsedId);
        localStorage.setItem("username", username);
        localStorage.setItem("name", name);
        localStorage.setItem("level", parsedLevel);
    };

    const logout = () => {
        setToken('');
        setId(null);
        setUsername('');
        setName('');
        setLevel(0);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ token, id, username, name, level, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

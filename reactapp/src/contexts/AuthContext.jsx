import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("jwt_token"));
    const [name, setName] = useState(localStorage.getItem("name"));
    const [level, setLevel] = useState(parseInt(localStorage.getItem("level")) || 0);

    const login = (token, name, level) => {
        const parsedLevel = parseInt(level);
        setToken(token);
        setName(name);
        setLevel(parsedLevel);
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("level", parsedLevel);
    };

    const logout = () => {
        setToken('');
        setName('');
        setLevel(0);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ token, name, level, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

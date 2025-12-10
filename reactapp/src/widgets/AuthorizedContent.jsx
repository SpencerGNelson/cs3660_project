import { useContext  } from "react";
import { AuthContext } from "../contexts/AuthContext";

function AuthorizedContent({ minLevel, children }) {
    const { level } = useContext(AuthContext)

    if (level < minLevel) {
        return null
    }
    return <>{children}</>
}

export default AuthorizedContent
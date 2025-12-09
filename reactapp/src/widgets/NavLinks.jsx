import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

function NavLinks({ links, filterHome = true }) {
    const { token, name, level, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const filteredLinks = filterHome ? links.filter(link => link.path !== '/') : links

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <ul className="navbar-nav">
            {filteredLinks.map((link) => (
                <li key={link.path} className="nav-item">
                    <Link className="nav-link" to={link.path}>
                        {link.label === 'Professionals' ? 'Support Staff' : link.label}
                    </Link>
                </li>
            ))}

            {/* Show Admin link if user has level >= 2 */}
            {token && level >= 2 && (
                <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                        Admin
                    </Link>
                </li>
            )}

            {/* Show Register and Login when not logged in */}
            {!token && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">
                            Register
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    </li>
                </>
            )}

            {/* Show user name and Logout when logged in */}
            {token && (
                <>
                    <li className="nav-item">
                        <span className="nav-link" style={{ color: '#fff' }}>
                            {name}
                        </span>
                    </li>
                    <li className="nav-item">
                        <button
                            className="nav-link btn btn-link"
                            onClick={handleLogout}
                            style={{ cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </li>
                </>
            )}
        </ul>
    )
}

export default NavLinks

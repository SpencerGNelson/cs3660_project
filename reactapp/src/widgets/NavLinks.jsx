import { Link } from 'react-router-dom'

function NavLinks({ links, filterHome = true }) {
    const filteredLinks = filterHome ? links.filter(link => link.path !== '/') : links

    return (
        <ul className="navbar-nav">
            {filteredLinks.map((link) => (
                <li key={link.path} className="nav-item">
                    <Link className="nav-link" to={link.path}>
                        {link.label === 'Professionals' ? 'Support Staff' : link.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NavLinks

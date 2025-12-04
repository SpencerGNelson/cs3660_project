import { Link } from 'react-router-dom'
import { navLinks } from '../../setup'

function Nav() {
    return (
        <div className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">ADHDer's Annonymous
                    <img src="/images/adhd.jpg" style={{width: '175px', padding: '10px'}}/>
                </Link>
                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#rightnav"
                    aria-label="Toggle controls"
                    aria-controls="rightnav"
                    aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="rightnav" className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        {navLinks.filter(link => link.path !== '/').map((link) => (
                            <li key={link.path} className="nav-item">
                                <Link className="nav-link" to={link.path}>
                                    {link.label === 'Professionals' ? 'Support Staff' : link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Nav


function Nav() {
    return (
        <div className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <a href="." className="navbar-brand">ADHDer's Annonymous
                    <img src="static/images/adhd.jpg" style={{width: '200px'}}/>
                </a>
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
                        <li className="nav-item"><a className="nav-link" href="professionals">Support Staff</a></li>
                        <li className="nav-item"><a className="nav-link" href="contact">Contact</a></li>
                        <li className="nav-item"><a className="nav-link" href="services">Services</a></li>
                        <li className="nav-item"><a className="nav-link" href="pay">Pay</a></li>
                        <li className="nav-item"><a className="nav-link" href="login">Login</a></li>
                        <li className="nav-item"><a className="nav-link" href="register">Register</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Nav


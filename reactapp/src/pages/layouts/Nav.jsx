import { LinkComponent, HamburgerButton, NavLinks, Image } from '../../widgets'

function Nav({ links }) {
    return (
        <div className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                <LinkComponent to="/" className="navbar-brand">
                    ADHDer's Annonymous
                    <Image src="images/adhd.jpg" style={{width: '175px', padding: '10px'}} alt="ADHD Logo" />
                </LinkComponent>
                <HamburgerButton target="rightnav" />
                <div id="rightnav" className="collapse navbar-collapse">
                    <NavLinks links={links} />
                </div>
            </div>
        </div>
    )
}
export default Nav


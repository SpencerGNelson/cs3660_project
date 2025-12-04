import { LinkComponent, HamburgerButton, NavLinks } from '../../widgets'

function AdminNav({ links }) {
    const linksWithBack = [...links, { path: '/', label: 'Back to Main Site' }]

    return (
        <div className="navbar navbar-expand-lg bg-secondary navbar-dark">
            <div className="container-fluid">
                <LinkComponent to="/admin" className="navbar-brand">Admin Panel</LinkComponent>
                <HamburgerButton target="adminNav" />
                <div id="adminNav" className="collapse navbar-collapse">
                    <NavLinks links={linksWithBack} filterHome={false} />
                </div>
            </div>
        </div>
    )
}

export default AdminNav

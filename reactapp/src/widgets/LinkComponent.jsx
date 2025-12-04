import { Link as RouterLink } from 'react-router-dom'

function LinkComponent({ to, children, className = "" }) {
    return (
        <RouterLink to={to} className={className}>
            {children}
        </RouterLink>
    )
}

export default LinkComponent

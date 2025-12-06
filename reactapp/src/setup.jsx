// Application-wide settings and configuration

export const navLinks = [
    {
        path: '/',
        label: 'Home'
    },
    {
        path: '/professionals',
        label: 'Professionals'
    },
    {
        path: '/services',
        label: 'Services'
    },
    {
        path: '/contact',
        label: 'Contact'
    },
    {
        path: '/pay',
        label: 'Pay'
    },
    {
        path: '/login',
        label: 'Login'
    },
    {
        path: '/register',
        label: 'Register'
    }
]

export const adminLinks = [
    {
        path: '/admin',
        label: 'Admin'
    },
    {
        path: '/admin/add_professional',
        label: 'Add Professional'
    },
    {
        path: '/admin/add_category',
        label: 'Add Category'
    },
    {
        path: '/admin/add_service',
        label: 'Add Service'
    }
]

export const appSettings = {
    appName: 'ADHD Support',
    apiBaseUrl: '',  // Empty string for relative URLs (since Flask serves the React app)
    defaultTheme: 'light'
}

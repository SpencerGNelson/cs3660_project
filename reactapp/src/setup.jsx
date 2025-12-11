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
    }
]

export const adminLinks = [
    {
        path: '/admin',
        label: 'User Management'
    },
    {
        path: '/',
        label: 'Back to Main Site'
    }
]

export const appSettings = {
    appName: 'ADHD Support',
    apiBaseUrl: import.meta.env.MODE === 'production' ? '/cs3660_project/Project/flaskapp' : '',  // Base URL for Flask API
    defaultTheme: 'light'
}

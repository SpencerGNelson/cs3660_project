import { useEffect } from 'react'

export function usePageTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} - ADHD Support` : 'ADHD Support'
    }, [title])
}

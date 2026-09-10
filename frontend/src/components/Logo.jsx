export default function Logo({ className = 'h-6 w-6' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="7" y1="7" x2="7" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="17" y1="7" x2="17" y2="17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    )
}
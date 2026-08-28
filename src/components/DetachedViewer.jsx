export function DetachedViewer({ children }) {
    return (
        <main className='flex bg-base-300 w-full h-screen'>
            {children}
        </main>
    );
}

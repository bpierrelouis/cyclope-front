export function ViewerMessage({ children, role = 'status', title }) {
    return (
        <main className='flex justify-center items-center bg-base-200 p-8 w-full h-screen'>
            <div className='max-w-lg alert' role={role}>
                <div>
                    <p className='font-semibold'>{title}</p>
                    {children && <p className='text-sm'>{children}</p>}
                </div>
            </div>
        </main>
    );
}

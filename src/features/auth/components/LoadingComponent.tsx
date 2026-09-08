import { Loader2 } from "lucide-react";


export function LoadingComponent() {
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='text-center'>
                <Loader2 className='animate-spin text-highlight-green mx-auto mb-4' size={48} />
                <p className='text-medium-gray'>Estamos preparando tudo para você...</p>
            </div>
        </div>
    )
}

import {Navigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

function ProtectedRoute({children}){
    const {user , loading} = useAuth()

    //Still checking localStorage on first load - show nothing/loading briefly
    if(loading){
        return <div className='container'><p>Loading...</p></div>
    }

    //Not logged in - redirect to login page
    if(!user){
        return <Navigate to="/login" replace />
        //                ^^^^^^^^^   ^^^^^^
        //                go to /login   replace history entry
        //                                (so back button doesn't return to protected page)
    }

    //Logged in - render whatever page was requested
    return children
}

export default ProtectedRoute
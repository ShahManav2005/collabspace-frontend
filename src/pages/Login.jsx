import {useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login() {
    const navigate = useNavigate()
    const {login} = useAuth()
    const [formData , setFormData] = useState({email : '' , password : ''})
    const [error , setError] = useState(null)
    const [loading , setLoading] = useState(false)

    function handleChange(e){
        setFormData({...formData , [e.target.name] : e.target.value })
    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            setLoading(true)
            setError(null)
            const response = await api.post('/auth/login',formData)

            login(response.data.user , response.data.token)

            navigate('/') // redirect to home after login
        }catch(err){
            setError(err.response?.data?.message || 'Login failed')
        }finally{
            setLoading(false)
        }
    }

    return(
        
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <img src="/favicon.png" alt="CollabSpace" className="auth-logo-img" />
                    <h2>Welcome back</h2>
                    <p>Login to CollabSpace</p>
                </div>

                {error && <div className="auth-error">❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                        type="email" 
                        name = "email"
                        placeholder='you@example.com'
                        value = {formData.email}
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                        type="password"
                        name="password"
                        placeholder="••••••••" 
                        value = {formData.password}
                        onChange = {handleChange}
                        required/>
                    </div>

                    <button type="submit" className ='auth-btn' disabled={loading}>
                        {loading ? 'Connecting... (may take 30s on first request)' : 'Login'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login 
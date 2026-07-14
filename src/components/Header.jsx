import {Link , useLocation, useNavigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

function Header(){
  const location = useLocation()
  const navigate = useNavigate()
  const{user , logout} = useAuth()

  function handleLogOut() {
    logout()
    navigate('/login')
  }

  return(
    <header>
      <div className="header-left">
        <img src="/favicon.png" alt="CollabSpace" className="header-logo-img" />
        <Link to="/" className="header-title">CollabSpace</Link>
      </div>

      <nav className="header-nav">

        <Link
        to="/"
        className= {`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home</Link>

        <Link
        to="/team"
        className= {`nav-link ${location.pathname === '/team' ? 'active' : ''}`}>
          Team</Link>

        <Link 
         to="/projects"
         className= {`nav-link ${location.pathname === '/projects' ? 'active' : ''}`}>
          Projects
         </Link>

         <Link
          to="/workspaces" className ={`nav-link ${location.pathname === '/workspaces' ? 'active' : ''}`}>
            Workspaces
         </Link>

      </nav>

      <div className="header-right">
        {user ? (
          <> 
            <span className="header-user">👤 {user.name}</span>
            <button className="logout-btn" onClick={handleLogOut}>Logout</button>
          </>
        ):(
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className = "header-register-btn"  >
            Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
export default Header
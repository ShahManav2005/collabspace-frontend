import {useAuth} from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Profile(){
    
    const { user } = useAuth()

    if(!user){
        return (
            <div className="container">
                <div className="error-screen">
                <h2>🔒 Please login to view your profile</h2>
                <Link to="/login" className="hero-btn">
                    Go to Login
                </Link>
                </div>
            </div>
    )  
}

    return(
       <div className="container">
      <div className="profile-card">
        <div className="profile-avatar">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <span className={`card-role ${user.role}`}>{user.role}</span>
        <div className="profile-details">
          <div className="detail-row">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="detail-row">
            <strong>Role:</strong> {user.role}
          </div>
          <div className="detail-row">
            <strong>User ID:</strong> {user._id}
          </div>
        </div>
      </div>
    </div>
    )
}
export default Profile
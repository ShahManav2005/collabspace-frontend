import {Link} from 'react-router-dom'

function NotFound(){
    return(
        <div className="container">
            <div style={{
                textAlign : 'center',
                padding : '80px 0'
            }}>
                <h1 style={{
                    fontSize : '80px',
                    fontWeight : '700',
                    color : '#6366f1',
                    marginBottom : '8px'
                }}>404</h1>

                <h2 style={{
                    fontSize : '24px',
                    color :'#0f172a',
                    marginBottom :'12px'
                }}>Page Not Found</h2>

                <p style={{
                    color : '#64748b',
                    marginBottom : '34px'
                }}>
                    The page you're looking for doesn't exist.
                </p>
                <Link to='/' className="hero-btn">
                    Back to home
                </Link>
            </div>
        </div>
    )
}
export default NotFound
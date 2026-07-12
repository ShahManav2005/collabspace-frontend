import {useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import api from '../api/axios'
import {useAuth} from '../context/AuthContext'

function Home(){
    const {user} = useAuth()

    const [stats , setStats] = useState({
        members : 0 ,
        activeProjects : 0,
        tasksDone : 0
    })

    const[loading , setLoading] = useState(true)

    async function loadStats() {
        try{
            setLoading(true)


            //Fetch all three in parallel - faster than one after another
            const [usersRes , projectRes , tasksRes ] = await Promise.all([
                api.get('/users'),
                api.get('/projects'),
                api.get('/tasks')
            ])

            const allProjects = projectRes.data.data 
            const allTasks = tasksRes.data.data 

            setStats({
                members : usersRes.data.count,
                activeProjects : allProjects.filter( p=> p.status === 'active').length,
                tasksDone : allTasks.filter(t=> t.status === 'done').length
            })
        }catch(error){
            console.log('Failed to load dashbord stats')
        }finally{
            setLoading(false)
        }
    }

    useEffect(() =>{
        loadStats()
    } , [])

    return(
        <div className="container">
            <div className="home-hero">
                <h1>Welcome back , {user?.name?.split(' ')[0]}</h1>
                <p>Your team collaboration platform</p>

                <div className="home-stats">
                    <div className="stat-card">
                        <h3>{loading ? '...' : stats.members}</h3>
                        <p>Team Members</p>
                    </div>
                    <div className="stat-card">
                        <h3>{loading ? '...' : stats.activeProjects}</h3>
                        <p>Active Projects</p>
                    </div>
                    <div className="stat-card">
                        <h3>{loading ? '...' : stats.tasksDone}</h3>
                        <p>Tasks Done</p>
                    </div>
                </div>

                <div style={{display : 'flex' , gap : '12px' , justifyContent : 'center' , margin:'32px'}}>
                    <Link to="/team" className='hero-btn'>View Team Directory</Link>

                    <Link to = "/workspaces" className="hero-btn" style={{background : '#8b5cf6'}}>
                        View Workspaces
                    </Link>

                    <Link to="/projects" className='hero-btn' style ={{background :'#0ea5e9'}}>
                        View Projects
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
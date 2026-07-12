import {Routes , Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import TeamPage from './pages/TeamPage'
import Profile from './pages/Profile'
import Projects from  './pages/projects'
import NotFound from './pages/Notfound'
import Login from './pages/Login'
import Register from './pages/Register'
import WorkspaceChat from './pages/WorkspaceChat'
import Workspace from './pages/Workspaces'
import Workspaces from './pages/Workspaces'

function App(){
  return (
    <>
      <Header/>
      <Routes>
        {/* Public routes - anyone can access */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />

        {/* Protected Routes must be logged in  */}
        <Route path="/"         element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/team"     element={<ProtectedRoute><TeamPage/></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects/></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Projects/></ProtectedRoute>} />
        <Route path='/Workspaces' element = {<ProtectedRoute><Workspaces /></ProtectedRoute>} />
        <Route path='/workspace/:workspaceId/chat' element={<ProtectedRoute><WorkspaceChat /> </ProtectedRoute>} />

        <Route path="*"         element={<NotFound/>} />


      </Routes>
      <Footer/>
    </>
  )
}
export default App
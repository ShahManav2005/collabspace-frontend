import { useState, useEffect } from 'react'
import api from '../api/axios'

function Projects() {
  const [projects, setProjects] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ New state — controls form visibility
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    workspace : ''
  })
  const [submitting, setSubmitting] = useState(false)

  const [expandedProject , setExpandedProject] = useState(null)
  const [tasksByProject , setTasksByProject] = useState({})
  const [taskFormData , setTaskFormData] = useState({title : '' , description : '' , priority : 'medium'})
  const [creatingTask , setCreatingTask] = useState(false)

  async function loadProjects() {
    try {
      setLoading(true)
      const response = await api.get('/projects')
      setProjects(response.data.data)
    } catch (error) {
      setError("Failed to load projects.")
    } finally {
      setLoading(false)
    }
  }

  async function loadWorkspaces(){
    try{
      const response = await api.get('/workspaces')
      setWorkspaces(response.data.data)
    }catch(error){
      setError("Failed to load projects.")
    }
  }

  async function loadTasksForProject(projectId){
    try{
      const response = await api.get(`/projects/${projectId}/tasks`)
      setTasksByProject((prev) => ({...prev , [projectId] : response.data.data}))
    }catch(error){
      console.log('Failed to load tasks')
    }
  }

  useEffect(() => { 
    loadProjects() 
    loadWorkspaces()
  }, [])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleTaskChanges(e){
    setTaskFormData({...taskFormData , [e.target.name] : e.target.value})
  }

  // ✅ This is a real submit handler — POST + refresh list
  async function handleCreateProject(e) {
    e.preventDefault()
    if(!formData.workspace){
      alert('Please select a workspace')
      return
    }
    try {
      setSubmitting(true)
      await api.post('/projects', formData)
      // Reset form and hide it
      setFormData({ title: '', description: '', priority: 'medium'  , workspace : ''})
      setShowForm(false)
      // Refresh the list to show the new project
      loadProjects()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  function toggleTasks(projectId){
    if(expandedProject === projectId){
      setExpandedProject(null)
    }else{
      setExpandedProject(projectId)
      if(!tasksByProject[projectId]){
        loadTasksForProject(projectId)
      }
    }
  }

  async function handleCreateTask(e , projectId) {
    e.preventDefault()
    if(!taskFormData.title){
      alert('Task title is required')
      return
    }
    try{
      setCreatingTask(true)
      await api.post('/tasks',{
        title : taskFormData.title,
        description : taskFormData.description,
        priority : taskFormData.priority,
        projectId : projectId
      })
      setTaskFormData({title : '' ,description : '' ,priority : 'medium'})
      loadTasksForProject(projectId) //refresh task list
    }catch(err){
      alert(err.response?.data?.message || 'Failed to create task')
    }finally{
      setCreatingTask(false)
    }
  }

  if (loading) return (
    <div className="container">
      <h2 style={{ color: '#0f172a', marginBottom: '24px' }}>📁 Projects</h2>
      <div className="memberGrid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton-card">
            <div className="skeleton skeleton-badge"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="container">
      <div className="error-screen">
        <p>❌ {error}</p>
        <button onClick={loadProjects}>Try Again</button>
      </div>
    </div>
  )

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h2 style={{ color: '#0f172a' }}>📁 Projects</h2>
        {/* ✅ Toggle form with state, not a weird async function */}
        <button className="refresh-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '13px' }}>
        {projects.length} projects found
      </p>

      {/* ✅ Conditionally rendered form — controlled inputs */}
      {showForm && (
        <form
          onSubmit={handleCreateProject}
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1.5px solid #e2e8f0',
            marginBottom: '24px'
          }}
        >
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              name="title"
              placeholder="Enter project name"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Workspace</label>
            <select name="workspace" value={formData.workspace} onChange={handleChange} required>
              <option value="">Select Workspace</option>
              {workspaces.map((ws) =>(
                <option key={ws._id} value={ws._id}> {ws.name} </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? 'Creating...' : 'Submit'}
          </button>
        </form>
      )}

      <div className="memberGrid">
        {projects.map((project) => (
          <div key={project._id} className="card">
            <div style={{
              background: '#eef2ff',
              color: '#4338ca',
              fontSize: '11px',
              fontWeight: '600',
              padding: '3px 10px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              Project #{project._id}
            </div>
            <div className="card-name">{project.title}</div>
            {/* ✅ Fixed — description not body */}
            <div className="card-email" style={{ marginTop: '8px', whiteSpace: 'normal' }}>
              {project.description}
            </div>

            {/* toggle tasks button */}
            <button
            onClick={() => toggleTasks(project._id)}
            style={{
              marginTop : '12px' , background : 'none' , border : 'none' , color : '#6366f1',
              fontSize : '12px' , fontWeight : '600' , cursor : 'pointer' , padding : 0
            }}>
              {expandedProject === project._id ? '▲ Hide Tasks' : `▼ View Tasks (${tasksByProject[project._id]?.length ?? '...'})`}
            </button>

{/* expanded task panel */}
{expandedProject === project._id && (
  <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', padding: '12px' }}>

    {/* Existing task list */}
    {tasksByProject[project._id]?.length > 0 ? (
      tasksByProject[project._id].map((task) => (
        <div key={task._id} style={{
          background: '#f8fafc', padding: '8px 10px', borderRadius: '8px',
          marginBottom: '6px', fontSize: '12px'
        }}>
          <strong>{task.title}</strong>
          <span style={{
            marginLeft: '8px', fontSize: '10px', color: '#64748b',
            textTransform: 'uppercase'
          }}>
            {task.status}
          </span>
        </div>
      ))
    ) : (
      <p style={{ fontSize: '12px', color: '#94a3b8' }}>No tasks yet</p>
    )}

    {/* add task mini form */}
    <form
      onSubmit={(e) => handleCreateTask(e, project._id)}
      style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
    >
      <input
        type="text"
        name="title"
        placeholder="New task title"
        value={taskFormData.title}
        onChange={handleTaskChanges}
        style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}
      />

      <button
        type="submit"
        disabled={creatingTask}
        style={{
          padding: '6px', background: '#6366f1', color: 'white', border: 'none',
          borderRadius: '6px', fontSize: '12px', cursor: 'pointer'
        }}
      >
        {creatingTask ? 'Adding...' : '+ Add Task'}
      </button>
    </form>
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
import {useState , useEffect } from 'react'
import {Link} from 'react-router-dom'
import api from '../api/axios'
import {useAuth} from '../context/AuthContext'

function Workspaces() {

    const {user} = useAuth()

    const [workspaces , setWorkspaces ] = useState([])
    const [users , setUsers] = useState([])
    const [loading , setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm , setShowForm] = useState(false)
    const [formData , setFormData ] = useState({name : '' , description : ''})
    const [submitting , setSubmitting ] = useState(false)

    const [addingMemberTo , setAddingMemberTo] = useState(null)
    const [selectedUserId , setSelectedUserId] = useState('')

    const [showMembersOf , setShowMemebersOf] = useState(null)

    async function loadWorkspaces() {
        try{
            setLoading(true)
            const respones = await api.get('/workspaces')
            setWorkspaces(respones.data.data)
        }catch(err){
            setError('Failed to load workspaces')
        }finally{
            setLoading(false)
        }
    }

    async function loadUsers(){
        try{
            const response = await api.get('/users')
            setUsers(response.data.data)
        }catch(err){
            console.log('Failed to load users')
        }
    }

    useEffect(() => {loadWorkspaces() 
        loadUsers() } , [])

    function handleChanges(e) {
        setFormData({...formData , [e.target.name] : e.target.value})
    }

    async function handeleCreate(e) {
        e.preventDefault() 
        try{
            setSubmitting(true)
            await api.post('/workspaces',formData)
            setFormData({name : '' , description: ''})
            setShowForm(false)
            loadWorkspaces()
        }catch(err){
            alert(err.response?.data?.message || 'Failed to create workspace')
        }finally{
            setSubmitting(false)
        }
    }

    async function handleAddMember(workspaceId){
        if(!selectedUserId){
            alert('Please select a user first')
            return
        }
        try{
            await api.post(`/workspaces/${workspaceId}/members` , {
                userId : selectedUserId
            })
            setAddingMemberTo(null)
            setSelectedUserId('')
            loadWorkspaces() // refresh to show updated member count
        }catch(err){
            alert(err.response?.data?.message || 'Failed to add member')
        }
    }

    async function handleRemoveMember(workspaceId , userId){
        const confirmed = window.confirm('Remove this member from worksapce?')
        if(!confirmed)  return

        try{
            await api.delete(`/workspaces/${workspaceId}/members/${userId}`)
            loadWorkspaces() 
        }catch(err){
            alert(err.response?.data?.message || 'Failed to remove member')
        }
    }

    if(loading) return <div className="container"><p>Loading workspaces...</p></div>

    if(error) return(
        <div className="container">
            <p>{error}</p>
            <button onClick={loadWorkspaces}>Try Again</button>
        </div>
    )

    return(
        <div className="container">
            <div style={{display:'flex' , justifyContent :'space-between' , alignItems: 'center', marginBottom : '16px'}}>
                <h2 style={{ color : '#0f172a'}}>🏢 Workspaces</h2>
                <button className='refresh-btn' onClick={() => setShowForm(!showForm)}> {showForm ? '✕ Cancel ' : '+ New Workspace'}</button>
            </div>

            {showForm && (
                <form onSubmit={handeleCreate} style={{ background : 'white' , padding : '20px' , borderRadius : '12px' , border : '1.5px solid #e2e8f0' , marginBottom : '24px'}}>
                    <div className="form-group">
                        <label>Workspace Name</label>
                        <input type="text" name="name" value ={formData.name} onChange={handleChanges} required/>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleChanges} />
                    </div>

                    <button type='submit' className='auth-btn' disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Workspace'}
                    </button>
                </form>
            )}

            <div className="memberGrid">
                {workspaces.length === 0 ? (
                    <p className='no-result'>No workspaces yet</p>
                ):(
                    workspaces.map((ws) => (
                        <div key={ws._id} className='card'>
                            <div className="card-name">{ws.name}</div>
                            <div className="card-email">{ws.description}</div>

                            <button
                                onClick={() => setShowMemebersOf(showMembersOf === ws._id ? null : ws._id)}
                                style={{
                                    background : 'none' , border : 'none' , color : '#64748b' , fontSize : '12px',
                                    marginTop : '8px' , cursor : 'pointer' , padding : 0 , textAlign : 'left'
                                }}
                                >
                                     👥 {ws.members?.length || 0} members {showMembersOf === ws._id ? '▲' : '▼'}
                                </button>

                            {/* expanded member list with remove button */}
                            {showMembersOf === ws._id && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {ws.members?.length > 0 ? (
                    ws.members.map((member) => (
                      <div
                        key={member._id}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', fontSize: '12px'
                        }}
                      >
                        <span>{member.name || 'Unknown user'}</span>
                        <button
                          onClick={() => handleRemoveMember(ws._id, member._id)}
                          style={{
                            background: 'none', border: 'none', color: '#ef4444',
                            cursor: 'pointer', fontSize: '14px', padding: '0 4px'
                          }}
                          title="Remove member"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>No members yet</p>
                  )}
                </div>
              )}
            
              {ws.members?.some(m=> m._id === user?.id) && (
                <Link to={`/workspace/${ws._id}/chat`} style={{display:'inline-block' , marginTop : '10px' , color : '#6366f1' , fontWeight : '600' , fontSize : '13px'}}>
                            Open Chat → 
                </Link>
              )}
                            

                            <div style={{marginTop : '12px' , borderTop :'1px solid #f1f5f9' , paddingTop : '12px'}}>
                                {addingMemberTo === ws._id ? (
                                    <div style={{display : 'flex' , gap:'6px'}}>
                                        <select 
                                            value={selectedUserId}
                                            onChange={(e) => setSelectedUserId(e.target.value)}
                                            style={{flex : 1 , padding : '6px' , borderRadius : '6px' ,border : '1px solid #e2e8f0' , fontSize : '12px'}}
                                            >
                                                <option value="">Select User</option>
                                                {users.map((u) =>(
                                                    <option key={u._id} value= {u._id}> {u.name} </option>
                                                ))}
                                        </select>

                                         <button
                                                onClick={() => handleAddMember(ws._id)}
                                                style={{padding: '6px 10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer'}}
                                            >
                                                Add
                                            </button>

                                        <button
                                            onClick={() => {setAddingMemberTo(null); setSelectedUserId('')}}
                                            style={{padding : '6px 10px' , background : '#e2e8f0' , border : 'none' , borderRadius : '6px' , fontSize : '12px' , cursor : 'pointer'}}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingMemberTo(ws._id)}
                                        style={{background : 'none' ,  border : 'none' , color : '#6366f1' , fontSize:'12px' , fontWeight : '600' , cursor : 'pointer' , padding : 0}}
                                    >
                                        + Add Member
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Workspaces 
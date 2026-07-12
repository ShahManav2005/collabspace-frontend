import { useState , useEffect} from 'react'
import MemberCard from '../components/MemberCard'
import StatBar from '../components/StatBar'
import api from '../api/axios'   //import axios instance


function TeamPage() {

  const [allMembers, setAllMembers] = useState([])
  const [loading , setLoading ] = useState(true)
  const [error, setError] = useState(null)
  const[search , setSearch] = useState("")
  const[filter , setFilter] = useState("all")
  const[selectedMember , setSelectedMember] = useState(null)

  //Fetch data on load

    async function loadMembers(){
      try{
        setLoading(true)
          
          // Axios - no need for response.ok check or .json()!
          const response = await api.get('/users');
          const data = response.data // Axios puts data here automatically

          const membersData = response.data.data

          setAllMembers(membersData)
        }
        catch(err){
        setError("Failed to load members. Please try agian.")
      }finally{
        setLoading(false)
      }
    }

    
  useEffect(() =>{
    loadMembers();
  } , []);

   function handleRefresh(){
    setSelectedMember(null)
    setSearch("")
    setFilter("all")
    loadMembers();
  }



  const total = allMembers.length
  const admins = allMembers.filter((m) => m.role === "admin").length
  const members = allMembers.filter((m) => m.role === "member").length
  const viewers = allMembers.filter((m) => m.role === "viewer").length


  let filtered = allMembers

  if (filter === "admin") {
    // BUG 2 FIX: filtered not filterd
    filtered = filtered.filter((m) => m.role === "admin")
  }
  if (filter === "member") {
    filtered = filtered.filter((m) => m.role === "member")
  }
 
  if (search !== ""){
      filtered = filtered.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    )
  }

 

  function handleCardClick(member) {
    if (selectedMember && selectedMember._id === member._id) {
      setSelectedMember(null)
    } else {
      setSelectedMember(member)
    }
  }


  if(loading){
    return (
      <>
          <div className="container">
          <h2 style = {{color : '0f172a' , marginBottom : '24px'}}>📁 Projects</h2>
          <div className="memberGrid">
              {/* show 6 fake grey cards while loading */}
              {[1,2,3,4,5,6].map((i)=>(
                  <div key={i} className="card skeleton-card">
                      <div className="skeleton skeleton-badge"></div>
                      <div className="skeleton skeleton-title"></div>
                      <div className="skeleton skeleton-text"></div>
                      <div className="skeleton skeleton-text short"></div>
                  </div>
              ))}
          </div>
      </div>
    </>
    )
  }

  // Error State
    if(error){
      return (
      <>
        <div className="container">
          <div className="error-screen">
          <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
        </>
    )
    }
      
  // Main Render
  return(
    <>
      <div className="container">
        
        <div style={{display: 'flex' , alignItems:'center' , justifyContent:'space-between' , marginBottom:'16px'}}>
        <h2 style={{color : '#0f172a' , marginBottom : '16px'}}>
          Team Directory
        </h2>
        <button className = "refresh-btn" onClick={handleRefresh}>Refresh</button>
        </div>

        <StatBar
          total = {total}
          admins={admins}
          members={members}
          viewers={viewers}
        />

        <div className="controls">
          <div className="searchbar">
            <input type="text" 
            placeholder="Search by name"
            value = {search}
            onChange={(e) => setSearch(e.target.value)}/>

            {search !== "" && (
              <button onClick={() => setSearch("")}>Clear</button>
            )}
          </div>

          <div className="filter-btns">

            <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}>
              All</button>

            <button
            className={filter === "admin" ? "active" : ""}
            onClick={() => setFilter("admin")}>
              Admins</button>

            <button
            className={filter === "member" ? "active" : ""}
            onClick={() => setFilter("member")}>
              Members</button>

          </div>
        </div>

        <p id="memberCount">
          Showing {filtered.length} of {allMembers.length} members
        </p>

        {selectedMember && (
          <div id="detail">
            <h3>{selectedMember.name}</h3>
            <div className="detail-row">
              <strong>Email:</strong>{selectedMember.email}
            </div>
            <div className="detail-row">
              <strong>Phone:</strong>{selectedMember.phone}
            </div>
            <div className="detail-row">
              <strong>City:</strong>{selectedMember.address.city}
            </div>
            <div className="detail-row">
              <strong>Company:</strong>{selectedMember.company.name}
            </div>
            <div className="detail-row">
              <strong>Website:</strong>{selectedMember.website}
            </div>

          </div>
        )}

        <div className="memberGrid">
            {filtered.length === 0 ? (
              <p className="no-results">No members found</p>
            ) : (
              filtered.map((member) => (
                <MemberCard
                  key = {member._id}
                  name = {member.name}
                  email = {member.email}
                  role = {member.role}
                  isSelected={selectedMember?.id === member.id}
                  onClick={() => handleCardClick(member)}
                />
              ))
            )}
        </div>
      </div>
      {/* <Footer/> */}
    </>
  )
}

export default TeamPage 
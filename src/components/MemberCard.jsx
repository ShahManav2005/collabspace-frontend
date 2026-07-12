function MemberCard({name , email , city , company , role="member" , isSelected , onClick}) {
  return (
    <div 
      className= {`card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      >

      <div className="avatar">{name[0]}</div>
      <div className="card-name">{name}</div>
      <div className="card-email">{email}</div>
      <div className="card-city">{city}</div>
      <div className="card-company">{company}</div>
      <div className={`card-role ${role}`}>{role}</div>
    </div>
  )
}

export default MemberCard
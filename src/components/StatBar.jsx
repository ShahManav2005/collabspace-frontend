function StatBar({total , admins , members , viewers}){
    return (
        <div className="statbar">
            <span>👥 Total : {total}</span>
           <span>👑 Admins : {admins}</span>
            <span>🧑 Members : {members}</span>
           <span>👁 Viewers : {viewers}</span>
        </div>
    )
}

export default StatBar
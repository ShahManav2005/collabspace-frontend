import {useState , useEffect , useRef} from 'react'
import {useParams} from 'react-router-dom'
import api from '../api/axios'
import {useAuth} from '../context/AuthContext'

function WorkspaceChat() {
    const {workspaceId} = useParams()
    const {user} = useAuth()

    const [messages , setMessages] = useState([])
    const [newMessage , setNewMessage ] = useState('')
    const [loading , setLoading] = useState(true)
    const [error , setError] = useState(null)
    const [sending , setSending] = useState(false)

    const messageEndRef =  useRef(null)
    //ref = a way to directly grab a DOM element in React
    //we use it here to auto-scroll to the bottom on new message

    async function loadMessage(){
        try{
            setLoading(true)
            const response = await api.get(`/workspaces/${workspaceId}/messages`)
            setMessages(response.data.data)    
        }catch(err){
            setError('Failed to load message')
        }finally{
            setLoading(false)
        }
    }

    useEffect( ()=>{
        loadMessage()
    },[workspaceId])
    //re-fetch if workspaceId ever changes (eg. switching workspaces)

    //Auto-scroll to bottom whenever message change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior : 'smooth'})
    },[messages])

    async function handleSend(e) {
        e.preventDefault()
        if(newMessage.trim() === '') return

        try{
            setSending(true)
            await api.post(`/workspaces/${workspaceId}/messages`, { text: newMessage })
            setNewMessage('')
            loadMessage() // refresh to show the new messages
        }catch(err){
            alert(err.response?.data?.message || 'Failed to send message')
        }finally{
            setSending(false)
        }
    }

    if(loading) return(
        <div className="container">
            <p>Loading Messages...</p>
        </div>
    )

    if(error) return(
        <div className="container">
            <p>{error}</p>
        </div>
    )

   return (
    <div className="container">
        <h2 style={{ color: "#0f172a", marginBottom: "16px" }}>
            Workspace Chat
        </h2>

        <div className="chat-box">
            <div className="chat-message">
                {messages.length === 0 ? (
                    <p className="no-result">
                        No messages yet. Say hello!
                    </p>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`chat-message ${
                                    msg.sender?._id === user?.id
                                        ? "own-message"
                                        : ""
                                }`}
                            >
                                <div className="chat-sender">
                                    {msg.sender?.name || "Unknown"}
                                </div>

                                <div className="chat-text">
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Invisible div at bottom for auto-scroll */}
                        <div ref={messageEndRef} />
                    </>
                )}
            </div>

            <form
                className="chat-input-row"
                onSubmit={handleSend}
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />

                <button type="submit" disabled={sending}>
                    {sending ? "..." : "Send"}
                </button>
            </form>
        </div>
    </div>
   );
}

export default WorkspaceChat 
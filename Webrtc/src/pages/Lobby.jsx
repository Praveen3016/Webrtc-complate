
import React, {useState , useCallback , useEffect} from 'react'
import { useSocket } from '../context/socketProvider';
import { useNavigate } from 'react-router-dom';


function Lobby() {
  const [email , setEmail] = useState("");
  const [room , setRoom] = useState("");

  const {socket} = useSocket();
  const navigate = useNavigate()
 
  const handleSubmit = useCallback( (e) =>{
    
    socket.emit("room:join" , { email , room})


  },[email , room , socket])


 const handleJoinRoom = useCallback((data) =>{
    const {email , room} = data
    console.log(email,  room)
    navigate(`/room/${room}`);
 } ,[navigate])

  useEffect(()=>{
    socket.on("room:join" , handleJoinRoom)

    return () =>{
      socket.off("room:join" , handleJoinRoom)

    }
  } , [socket])


  return (
    <>

   <div className="homepage-container w-screen flex flex-col items-center justify-center min-h-screen bg-gray-100">
   <h2 className='text-center mb-8 text-2xl font-semibold text-gray-800 '>Lobby Room</h2>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Enter your email here"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Room Code"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <button onClick={ () => handleSubmit()} className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Join Room
                    </button>
                </div>
            </div>
        </div>    
        </>
  )
}

export default Lobby

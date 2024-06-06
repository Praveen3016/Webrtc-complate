    import React, { useCallback, useEffect, useState } from 'react'
    import { useParams } from 'react-router-dom'
    import { useSocket } from '../context/socketProvider';
    import { Socket } from 'socket.io-client';
    import ReactPlayer from 'react-player'
    import peer from '../Services/peer';


    function Room() {

        const { socket } = useSocket();
        const [remoteSocketId, setRemoteSocketId] = useState();
        const [myStream, setMyStream] = useState();
        const [remoteStream, setRemoteStream] = useState();



        const handleUserJoined = useCallback(({ email, id }) => {
            console.log(`Email ${email} joined romm`);
            setRemoteSocketId(id)
        }, [])

        const handleCallUser = useCallback(async (e) => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            const offer = await peer.getOffer();
            socket.emit("user:call", { to: remoteSocketId, offer })
            setMyStream(stream)
        }, [remoteSocketId, socket])

        const handleIncomingCall = useCallback(async ({ from, offer }) => {
            setRemoteSocketId(from)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setMyStream(stream)
            console.log("incomming call ", from, offer)
            const ans = await peer.getAnswer(offer)
            socket.emit("call:accepted" , {to : from , ans})
        }, [socket])

        const sendStream = useCallback(async () =>{
            for(const track of myStream.getTracks())
                {
                    peer.peer.addTrack(track , myStream)
                }
        },[myStream])

        const handleAcceptedCall = useCallback (async ({from , ans}) =>{
    await peer.setLocalDescription(ans);
    console.log("call accepted");
    sendStream();
    
        },[sendStream]);
        

        const handleNegoNeeded = useCallback( async () =>{
            const offer = await peer.getOffer();
            socket.emit("peer:nego:needed" ,{offer , to: remoteSocketId})
        } ,[remoteSocketId ,socket])


        const handleIncomingNego = useCallback( async ({from , offer}) =>{
            const ans = await peer.getAnswer(offer);
            socket.emit("peer.nego:done" , {to : from , ans})

        },[socket])

        const handleFinalNego = useCallback( async ({ ans})=>{
        await peer.setLocalDescription(ans) 
        },[])



        useEffect(() =>{
            peer.peer.addEventListener("negotiationneeded" , handleNegoNeeded);

            return () =>{
                peer.peer.removeEventListener("negotiationneeded" , handleNegoNeeded);

            }
        })

        useEffect(() =>{
        peer.peer.addEventListener('track' , async ev=>{
            const remoteStream =  ev.streams ;
            console.log("got tracks")
            setRemoteStream(remoteStream[0])
        })
        },[])

        useEffect(() => {
            socket.on("user:join", handleUserJoined)
            socket.on("incomming:call", handleIncomingCall)
            socket.on("call:accepted", handleAcceptedCall)
            socket.on("peer:nego:needed", handleIncomingNego)
            socket.on("peer:nego:final", handleFinalNego)




            return () => {
                socket.off("user:join", handleUserJoined);
                socket.off("incomming:call", handleIncomingCall);
                socket.off("call:accepted", handleAcceptedCall)
                socket.off("peer:nego:needed", handleIncomingNego)
                socket.off("peer:nego:final", handleFinalNego)


            }
        }, [socket, handleUserJoined , handleIncomingCall , handleAcceptedCall ,handleIncomingNego , handleFinalNego])

        const { roomid } = useParams();
        return (
            <div className='flex w-screen h-screen justify-center items-center bg-gray-100'>
                <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4'>
                    <h2 className='text-3xl font-semibold underline'>Room {roomid}</h2>
                    <h4 className={`font-semibold ${remoteSocketId ? 'text-green-600' : 'text-red-600'}`}>
                        {remoteSocketId ? "Connected" : "No One in Room"}
                    </h4>
                    {myStream && <button onClick={sendStream} >Send Stream</button>}

                    {remoteSocketId && (
                        <button
                            className='border w-20 py-1 rounded font-light text-white bg-blue-600 hover:bg-blue-700 transition duration-300'
                            onClick={handleCallUser}
                        >
                            Call
                        </button>
                    )}
           <div className='flex gap-3'>
                    {myStream && (
                        <div className='flex flex-col'>
                            <p>My stream</p>
                            <ReactPlayer
                                className='rounded-md shadow-lg  mt-0  border-2 '
                                url={myStream}
                                playing
                                muted
                                width='300ox'
                                height='200px'
                            />
                        </div>
                    )}
                    {remoteStream && (
                        <div className='flex flex-col'>
                            <p>remote stream</p>
                            <ReactPlayer
                                className='rounded-md shadow-lg  mt-0  border-2 '
                                url={remoteStream}
                                playing
                                muted
                                width='300ox'
                                height='200px'
                            />
                        </div>
                    )}
                    </div>
                </div>
            </div>
        )
    }

    export default Room

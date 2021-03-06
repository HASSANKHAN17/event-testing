
import React from 'react'
import {connect} from 'react-redux'
import ChatDetail from './ChatDetail';
import Dashhead from '../Dashhead/Dashhead'
import axios from 'axios'
import Button from '@mui/material/Button'
import io from 'socket.io-client'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import "./Chats.scss"
import {storeSocket} from '../../redux/socket/socketActions'
import SpeakerNotesOffOutlinedIcon from '@mui/icons-material/SpeakerNotesOffOutlined';
import FailureScreen from '../../utils/FailureScreen';
import {renderTimeDate} from '../../utils/renderDate'
const  socket = io.connect(process.env.REACT_APP_DEVELOPMENT)
function Chats(props) {
    const [chatList,setChatList]=React.useState([])
    const [room, setRoom] = React.useState("");
    const [messages,setMessages]= React.useState([])
    const [username,setUsername]=React.useState("")
    const [counts,setCount]=React.useState(false)
    const [display,setDisplay]=React.useState(false)
    const [name,setName]=React.useState("")
    const [active,setActive]=React.useState("")

    const getEventConnect=async ()=>{
        await socket.emit("event_connect",props.EventUser.userInfo._id)
    }

    React.useEffect(()=>{
        getEventConnect()
        //if user is navigated from event detail then join room here
        
          axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/conv/user-con`, {headers: {token: props.EventUser.user}})
            .then(async response =>  {
                console.log(response.data.result)
                setChatList(response.data.result)
                let localchatList = response.data.result
                await socket.on("count",(conversationId)=>{
                    //setCount(conversationId)
                    console.log("inside couujuuuuuuuuuuuuuuuuuuuuuunt");
                    let index = 0
                    let ar = localchatList.filter((item,indexC)=>{
                        if(item._id===conversationId){
                            index=indexC
                        }
                        return item._id===conversationId
                        
                    })
                    console.log("aris",ar);
                    if(ar.length>0){
                        let count = -ar[0].unseen
                        count = count+1
                        console.log("countis",count,index);
                        localchatList[index].unseen=-count;
                    console.log("localchatlist",localchatList);
                        let items = localchatList.filter(item=>item!==ar[0])
                        items.unshift(ar[0])
                        setChatList(items)
                        setCount(!counts)
                    }else{
                        console.log("chatlist is mpy");
                    }
        
                })
            });

    },[counts])


    
    const joinRoom = async (item,index)=>{
        console.log("joininiiiiiiiing roooooooooooom")
        setActive(index)
        if(room!==""){
            await socket.emit("leave_room", room)
        }
            setName(renderName(item))
            await socket.emit("join_room", item._id, props.EventUser.userInfo._id, item.unseenMsg);
            setRoom(item._id)
            setUsername(props.EventUser.userInfo._id)
            item.unseen = 0;
            setCount(!counts)
            await socket.on("all-msg", async (data) => {
            //    await socket.emit("seen_msg", item.unseen, item._id);
              //console.log(data)
              props.storeSocket(data)
              setMessages(data);
            });
        
        
    }
    



    
    const renderName = (item)=>{
        if(item.name.length===1){
            return item.name[0]
        }else{
          let name = item.name.filter(e=>e.userId!==props.EventUser.userInfo._id)
          return name[0].name
        }
    }
    return (
        <div className="row chats">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={5} display={display} />
        </div>

        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container">
            <span className="iconbutton">
        <IconButton  size="large" aria-label="Menu" onClick={()=>setDisplay(true)}>
        <MenuIcon fontSize="inherit" />
         </IconButton>
         </span>
        {chatList.length>0?<div className="row conversations">
            <div className="col-4">
            {
                chatList.map((item,index)=>(
                    <div onClick={()=>joinRoom(item,index)} key={index} className={item.unseen===0?(active===index?"conversation-card-activeconversation":"conversation-card"):"conversation-card-active"}>
                    <div  className="row align-items-center justify-content-between">
                        {/* {
                            console.log(active,index)
                        } */}
                        <div>
                        <h3>{renderName(item)}</h3>
                        </div>
                        <div>
                        {item.unseen!==0?<div className="badge">{-item.unseen}</div>:null}
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between">
                    <div>                    
                    <p className="message">{Object.keys(item).includes("lastMsg")?(item.lastMsg.text.length>30?item.lastMsg.text.slice(0,30)+"...":item.lastMsg.text):"start a new conversation"}</p>
                    </div>
                    <div>                    
                    <p className="time">{renderTimeDate(item.updatedAt)}</p>
                    </div>
                    </div>
                     
                        
                    </div>
                ))
            }
            </div>
            <div className="col-8">
            <ChatDetail name={name} username={username} room={room} messages={messages} setMessages={setMessages} socket={socket} />
            </div>
        </div>:
        <FailureScreen icon={<SpeakerNotesOffOutlinedIcon sx={{fontSize:"4em"}} color="primary" />} title="You don't have any conversations" />
        }
        </div>
        </div>
    )
}
const mapStateToProps = ({EventUser})=>{
    return {
        EventUser
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        storeSocket:(messages)=>dispatch(storeSocket(messages))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Chats)

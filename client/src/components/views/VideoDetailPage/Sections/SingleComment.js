import React, { useState } from 'react'
import {Comment, Avatar, Button, Input} from 'antd'
import {useSelector} from 'react-redux'
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

const {TextArea} = Input;


function SingleComment(props) {

    // url에 있는 videoId 가져옴 
    const videoId = props.videoId;
    
    // redux를 이용해 state에 저장된 user정보 가져옴
    const user = useSelector(state => state.user);

    const [OpenReply,setOpenReply] = useState(false)
    const [CommentValue,setCommentValue] = useState("")

    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (event) =>{
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            content: CommentValue, 
            writer: user.userData._id, //로그인한 user id
            postId: props.postId, // 참조하는 video id
            responseTo: props.comment._id //참조하는 댓글 id 
        }

        alert('postId : ' + variable.postId)

        Axios.post('/api/comment/saveComment',variable)
        .then(response=>{
            if(response.data.success){
                console.log(response.data.result)
                setCommentValue("")
                setOpenReply(false)
                // 부모 컴포넌트인 VideoDetailPage에 저장한 정보 알려주기 
                props.refreshFunction(response.data.result)
            }else{
                alert('코멘트를 저장하지 못했습니다.')
            }
        })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt/>}
                content = {<p>{props.comment.content}</p>}
            />         

            {OpenReply &&
                <form style={{display:'flex'}} onSubmit={onSubmit}>
                    <textarea
                        style={{width:'100%',borderRadius:'5px'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해 주세요"
                    />
                    <br />
                    <button style={{width:'20%', height:'52px'}} onClick={onSubmit}>Submit</button>
                </form>  
            }
        </div>
    )
}

export default SingleComment
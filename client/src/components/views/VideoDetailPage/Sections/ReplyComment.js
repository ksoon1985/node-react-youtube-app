import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'


function ReplyComment(props) {

    const [ChildCommentNumber,setChildCommentNumber] = useState(0)
    const [OpenReplyComments,setOpenReplyComments] = useState(false)

    useEffect(()=>{
        let commentNumber = 0;

        props.commentList.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber);

    },[props.commentList]) // []-> 처음에만 실행, 부모로온 commentList가 바뀔 때 마다 다시 실행하라 

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    const renderReplyComment = (parentCommentId)=>
        props.commentList.map((comment,index)=>(
            <React.Fragment>
            {
                comment.responseTo === parentCommentId &&
                <div key={index} style={{width:'80%', marginLeft:'40px'}}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId}/>
                    <ReplyComment refreshFunction={props.refreshFunction} commentList={props.commentList} parentCommentId={comment._id} postId={props.postId}/>
                </div>
                
            }
            </React.Fragment>
        ))
    

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{fontSize:'14px', margin:0, color:'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)   
            }

        </div>
    )
}

export default ReplyComment
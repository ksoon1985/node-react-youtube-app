import Axios from 'axios'
import React , {useState} from 'react'
import {useSelector} from 'react-redux'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    // url에 있는 videoId 가져옴 
    const videoId = props.postId;

    // redux를 이용해 state에 저장된 user정보 가져옴
    const user = useSelector(state => state.user);

    const [CommentValue, setCommentValue] = useState("")
  
    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) =>{
        // 새로고침 막음 
        event.preventDefault();

        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId 
        }

        Axios.post('/api/comment/saveComment',variable)
        .then(response=>{
            if(response.data.success){
                console.log(response.data.result)
                setCommentValue("")
                // 부모 컴포넌트인 VideoDetailPage에 저장한 정보 알려주기 
                props.refreshFunction(response.data.result)
            }else{
                alert('코멘트를 저장하지 못했습니다.')
            }
        })
    }
  
    return (
    <div>
        <br />
        <p> Replies</p>
        <hr />

        {/* Comment Lists */}
        {props.commentList && props.commentList.map((comment,index)=> (

            //답글이 아닌경우 (댓글인 경우 )
            (!comment.responseTo && 
                <React.Fragment>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}/>
                    <ReplyComment refreshFunction={props.refreshFunction} commentList={props.commentList} parentCommentId={comment._id} postId={videoId}/>
                </React.Fragment>

            )
        ))}

        <hr />

        {/* Root Comment Form */}
        <form style={{display:'flex'}} onSubmit={onSubmit} >
            <textarea 
                style={{width:'100%',borderRadius:'5px'}}
                onChange={handleClick} // 이걸 해야 댓글란에 타이핑이 가능 
                value={CommentValue}
                placeholder="코멘트를 작성해 주세요"

            />
            <br />
            <button style={{width:'20%',height:'52px'}} onClick={onSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default Comment
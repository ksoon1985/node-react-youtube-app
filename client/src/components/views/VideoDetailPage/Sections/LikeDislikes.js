import { Tooltip, Icon } from 'antd'
import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function LikeDislikes(props) {

    let variable = {}

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    
    if(props.video){
        variable = {videoId: props.videoId , userId: props.userId}
    }else{
        variable = {commentId: props.commentId , userId: props.userId}
    }

    useEffect(()=>{

        Axios.post('/api/like/getLikes',variable)
        .then(response =>{
            if(response.data.success){
                // 얼마나 많은 좋아요를 받았는지
                setLikes(response.data.likes.length)

                // 내가 이미 그 좋아요를 눌렀는지
                response.data.likes.map(like =>{
                    if(like.userId === props.userId){
                        setLikeAction('liked')
                    }
                })
            }else{
                alert('Likes 정보를 가져오지 못했습니다. ')
            }
        })

        Axios.post('/api/like/getDislikes',variable)
        .then(response =>{
            if(response.data.success){
                // 얼마나 많은 싫어요 받았는지
                setDislikes(response.data.dislikes.length)

                // 내가 이미 그 싫어요 눌렀는지
                response.data.dislikes.map(dislike =>{
                    if(dislike.userId === props.userId){
                        setDislikeAction('disliked')
                    }
                })
            }else{
                alert('Dislikes 정보를 가져오지 못했습니다. ')
            }
        })

    },[])


    /*
        좋아요
        # 좋아요가 안눌러져 있을 때 
            - 싫어요가 눌러져 있을 때 -> 좋아요 올림 + 싫어요 내림
            - 싫어요가 안눌러져 있을 때 -> 좋아요 올림
        # 좋아요가 눌러져 있을 때
            -> 좋아요만 내리면 됨 
    */

    const onLike = ()=>{

        if(LikeAction === null){

            Axios.post('/api/like/upLike',variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes + 1)
                    setLikeAction('liked')

                    if(DislikeAction !== null){
                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)
                    }
                }else{
                    alert('Like를 올리지 못했습니다.')
                }
            })
        }else{

            Axios.post('/api/like/unlike',variable)
            .then(response=>{
                if(response.data.success){
                    setLikes(Likes - 1)
                    setLikeAction(null)
                }else{
                    alert('Like를 내리지 못했습니다. ')
                }
            })
        }
    }

    const onDislike = () =>{

        if(DislikeAction !== null){

            Axios.post('/api/like/unDislike',variable)
            .then(response=>{
                if(response.data.success){
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null)
                }else{
                    alert('Dislike을 올리지 못했습니다.')
                }
            })
        }else{

            Axios.post('/api/like/upDislike',variable)
            .then(response=>{
                if(response.data.success){
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')
                    
                    if(LikeAction !== null){
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    }
                }else{
                    alert('Dislike을 내리지 못했습니다.')
                }
            })
        }

    }

    

  return (
    <div>
        <span key="comment-basic-like">
            <Tooltip title="Like">
                <Icon type='like'
                    theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                    onClick={onLike}
                />
            </Tooltip>
            <span style={{paddingLeft:'8px', cursor:'autu'}}> {Likes} </span>
        </span>&nbsp;&nbsp;

        <span key="comment-basic-dislike">
            <Tooltip title="Dislike">
                <Icon type='dislike'
                    theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                    onClick={onDislike}
                />
            </Tooltip>
            <span style={{paddingLeft:'8px', cursor:'autu'}}> {Dislikes} </span>
        </span>&nbsp;&nbsp;
    </div>
  )
}

export default LikeDislikes
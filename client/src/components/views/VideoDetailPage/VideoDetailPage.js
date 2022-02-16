import React,{useEffect,useState} from 'react'
import {Row,Col, List,Avatar} from 'antd'
import axios from 'axios'
import SideVideo from './Sections/SideVideo'
import Subscribe from './Sections/Subscribe'
import Comment from './Sections/Comment'

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId; // app.js 에서 exact path="/video/:videoId" -> :videoId 했기 때문에 사용 가능
    const variable = { videoId: videoId};

    const [VideoDetail,setVideoDetail] = useState([])

    const [Comments, setComments] = useState([]);

    useEffect(()=>{

        // 비디오 상세 정보 가져오기
        axios.post('/api/video/getVideoDetail',variable)
        .then(response=>{
            if(response.data.success){
                setVideoDetail(response.data.videoDetail)
            }else{
                alert('비디오 정보를 가져오길 실패했습니다.')
            }
        })

        // 해당 비디오에 해당하는 댓글들 가져오기 
        axios.post('/api/comment/getComments',variable)
        .then(response=>{
            if(response.data.success){
                console.log(response.data.comments)
                setComments(response.data.comments)
            }else{
                alert('코멘트 정보를 가져오는 것을 실패 하였습니다.')
            }
        })


    },[])

    const refreshFunction = (newComment) =>{
        setComments((Comments.concat(newComment)))
    }


    if(VideoDetail.writer){

        const subscriptionButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo = {VideoDetail.writer._id} userFrom = {localStorage.getItem('userId')} />

        return (
            <Row gutter={[16,16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%',padding:'3rem 4rem'}}>

                        {/* video 영역 */}
                        <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
    
                        <List.Item
                            actions={[subscriptionButton]}
                        >
                            <List.Item.Meta 
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
    
                        </List.Item>
    
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentList={Comments} postId= {videoId}/>
                    </div>
    
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
      )
    }else{
        return (
            <div>
                 ...loading 
            </div>
        )
    }
}

export default VideoDetailPage
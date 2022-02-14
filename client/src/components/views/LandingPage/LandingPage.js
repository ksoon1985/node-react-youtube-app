import React, { useEffect , useState} from 'react'
import { FaCode } from "react-icons/fa";
import {Card,Icon,Avatar,Col,Typography,Row} from 'antd';
import axios from 'axios';

import moment from 'moment';
const {Title} = Typography;
const {Meta} = Card;


function LandingPage() {

    const [Video,setVideo] = useState([])


    // dom이 load되자마자 무엇을 할 것인지
    // 즉 LandingPage 오자마자 아래 코드를 실행
    useEffect(()=>{
       axios.get('/api/video/getVideos') 
       .then(response=>{
           if(response.data.success){
               console.log(response.data)
               setVideo(response.data.videos)
           }else{
               alert('비디오 가져오기를 실패 했습니다.')
           }
       })
    }, [])


    const renderCards = Video.map((video,index)=>{

        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/post/${video._id}`}>
              <div style={{position: 'relative'}}>
                  <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                  <div className='duration'>
                        <span>{minutes}: {seconds}</span>
                 </div>
              </div>
            </a>
         <br />
            <Meta
             avatar={
                   <Avatar src={video.writer.image}/>
              }
            title={video.title}
            description=""
            />
            <span>{video.writer.name}</span>
            <br />
            <span style={{marginLeft:'3rem'}}>{video.views} views</span> - <span>{moment(video.createAt).format("MMM Do YY")}</span>
        </Col>
    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}>Recommened</Title>
            <hr />
        
            {/*한개의 Row 에 4개의 Col, */}
            <Row gutter={[32,16]}>

                {renderCards}

            </Row>

        </div>
    )
}

export default LandingPage

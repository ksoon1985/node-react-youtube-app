import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Card,Icon,Avatar,Col,Typography,Row} from 'antd';

import moment from 'moment';
const {Title} = Typography;
const {Meta} = Card;

function SubscriptionPage() {

    const [Videos,setVideos] = useState([])

    useEffect(()=>{

        const subscriptionVariables = {
            userFrom : localStorage.getItem('userId')
        }

        axios.post('/api/video/getSubscriptionVideos',subscriptionVariables)
        .then(response=>{
            if(response.data.videos){
                console.log(response.data.videos)
                setVideos(response.data.videos)
            }else{
                alert('Failed to get Videos')
            }
        })
    },[])

    const renderCards = Videos.map((video,index)=>{

        var minutes = Math.floor(video.duration/60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/${video._id}`}>
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

export default SubscriptionPage
import React, { FC } from 'react';
import { Button, Col, Dropdown, PageHeader, Row, Image } from 'antd';
import { Menu} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';


var mouseData = ['Jake', 'Jon', 'Thruster'];
var mouseList = mouseData.map(function(name){
  return <li>{name}</li>;
})
function DummyGrid() {

  const mouseData = [
    { id: 1, ref:1234, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
    { id: 2, ref:233, img:'/img/dummymice.png', ethPrice:'11E', usdPrice:'$47.12K'},
    { id: 3, ref:3434, img:'/img/dummymice.png', ethPrice:'40E', usdPrice:'$123.12K'},
    { id: 4, ref:5565, img:'/img/dummymice.png', ethPrice:'34E', usdPrice:'$37.12K'},
    { id: 5, ref:4334, img:'/img/dummymice.png', ethPrice:'5E', usdPrice:'$37.12K'},
    { id: 6, ref:2222, img:'/img/dummymice.png', ethPrice:'34E', usdPrice:'$37.12K'},
    { id: 7, ref:3333, img:'/img/dummymice.png', ethPrice:'65E', usdPrice:'$37.12K'},
    { id: 8, ref:4343, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
    { id: 9, ref:3443, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
    { id: 10, ref:6565, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
    { id: 11, ref:1, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
    { id: 12, ref:3223, img:'/img/dummymice.png', ethPrice:'10E', usdPrice:'$37.12K'},
  ];

    return(
      <Row  style={{ marginTop: '50px'}}>
      {mouseData.map(mouse => (
         <Col span={4} style={{ }}>
         <Title level={4} style={{ marginTop: '0px'}} type="secondary">#{mouse.ref}</Title>
           <Image
           style={{ marginTop: '-10px'}}
           src={`${process.env.PUBLIC_URL}${mouse.img}`}
         />
         <Title level={4} style={{ marginTop: '-10px'}}>{mouse.ethPrice}</Title>
         <Title level={4} style={{ marginTop: '-10px'}}>{mouse.usdPrice}</Title>
       </Col>
      ))}
    </Row>
    );
}
  
export default DummyGrid;


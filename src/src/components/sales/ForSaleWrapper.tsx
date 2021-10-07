import React from 'react';
import { Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import DummyGrid from './DummyGrid';

function ForSaleWrapper() {
    return(
        <>
            <Row  style={{ marginTop: '100px'}}>
            <Col span={24} style={{ }}>
            <Title level={2}>Mices for sale</Title>
                <Title level={4} style={{ marginTop: '0px'}} type="secondary">The lowest price Mice currently for sale is 10 E</Title>
                <Title level={4} style={{ marginTop: '-10px'}} type="secondary">Showing most recent offers, <a href="">click here to see all 221</a>.</Title>
                </Col>
            </Row>
            <DummyGrid/>
        </>
    );
}
  
export default ForSaleWrapper;
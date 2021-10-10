import React, { FC } from 'react';
import { Col, Row } from 'antd';
import './App.css';
import { Layout } from 'antd';
import NavBar from './components/header/NavBar'
import ContentHeader from './components/header/ContentHeader'
import { Symfoni } from './hardhat/SymfoniContext';
import ForSaleWrapper from './components/sales/ForSaleWrapper';
const { Content, Footer } = Layout;

const App: FC = () => (
  <div className="App">
    <Symfoni autoInit={false} showLoading={false} >
      <Layout className="layout">
      <NavBar/>
        <Content style={{ padding: '0 50px', background:'#fff' }}>
          <div className="site-layout-content"> 
            <Row>
              <Col span={2}></Col>
              <Col span={20}>
                
                <ForSaleWrapper />                

                <img alt="why"
                  style={{ marginTop: '100px'}}
                  src={`${process.env.PUBLIC_URL}/img/whymice.png`}
                />
                
              </Col>
              <Col span={2}></Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>We Like The Mice.</Footer>
      </Layout>
    </Symfoni>
  </div>
);

export default App;
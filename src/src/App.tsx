import React, { FC } from 'react';
import { Button, Col, Divider, Dropdown, PageHeader, Row, Space } from 'antd';
import './App.css';
import { Layout, Menu, Breadcrumb, Typography, Image} from 'antd';
import NavBar from './components/header/NavBar'
import ContentHeader from './components/header/ContentHeader'
import LargestSalesWrapper from './components/sales/SalesWrapper'
import ForSaleWrapper from './components/sales/ForSaleWrapper'
import Stats from './components/stats/Stats'
const { Title } = Typography;
const { Header, Content, Footer } = Layout;

const App: FC = () => (
  <div className="App">
      <Layout className="layout">
      <NavBar/>
        <Content style={{ padding: '0 50px', background:'#fff' }}>
          <div className="site-layout-content"> 
            <Row>
              <Col span={2}></Col>
              <Col span={20}>
                <ContentHeader/>
                <LargestSalesWrapper/>
                <ForSaleWrapper/>
                <Stats/>
                <Image
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
    
  </div>
);

export default App;
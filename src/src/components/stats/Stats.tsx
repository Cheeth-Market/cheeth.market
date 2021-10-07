import { Col, Row, Image } from 'antd';
import Title from 'antd/lib/typography/Title';


function Stats() {
    return(
        <>
            <Row  style={{ marginTop: '100px'}}>
                <Col span={24} style={{ }}>
                    <Title level={2}>Anonymice stats</Title>
                    <Title level={4} style={{ marginTop: '0px'}} type="secondary">awd awd awddawawddaw wda awd awd awd a wd awdawd  awdawd d</Title>
                </Col>
                </Row>
                <Row gutter={12} style={{ marginTop: '100px'}}>
                <Col flex={2}>
                    <Image
                    style={{}}
                    src={`${process.env.PUBLIC_URL}/img/marketmiceside.png`}
                /></Col>
                <Col flex={3} style={{textAlign:'left'}}>
                <Title level={2} style={{ marginTop: '0px'}}>Lowest Price</Title>
                    <Title level={4} style={{ marginTop: '-10px'}} type="secondary">Current Lowest Price Mice Available</Title>
                    <Title level={4} style={{ marginTop: '-10px'}} type="secondary">10 ETH ($23,332 USD)</Title>

                    <Title level={2} style={{ marginTop: '30px'}}>Number of Sales</Title>
                    <Title level={4} style={{ marginTop: '-10px'}} type="secondary">12331</Title>

                    <Title level={2} style={{ marginTop: '30px'}}>Total Value</Title>
                    <Title level={4} style={{ marginTop: '0px'}} type="secondary">1234 ETH ($123,4232 USD)</Title>

                    <Title level={2} style={{ marginTop: '30px'}}>Something else</Title>
                    <Title level={4} style={{ marginTop: '0px'}} type="secondary">awd wad awdaw  wdawda wda dwa</Title>
                    <Title level={4} style={{ marginTop: '-10px'}} type="secondary">dwadwawa ddawawd  adw</Title>
                </Col>
            </Row>
        </>
    );
}
  
export default Stats;
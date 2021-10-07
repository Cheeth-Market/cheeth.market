import { Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import DummyGrid from './DummyGrid';

function LargestSalesWrapper() {
    return(
        <>
            <Row  style={{ marginTop: '100px'}}>
                <Col span={24} style={{ }}>
                    <Title level={2}>Largest Sales</Title>
                    <Title level={4} style={{ marginTop: '0px'}} type="secondary">Lorem ipsum dolor dawadwwda daw awd  dawawd .</Title>
                </Col>
            </Row>
            <DummyGrid/>
        </>
    );
}
  
export default LargestSalesWrapper;
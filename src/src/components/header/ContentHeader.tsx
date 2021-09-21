import React, { FC } from 'react';
import { Button, Dropdown, PageHeader, Image} from 'antd';
import { Menu} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';

function ContentHeader() {
    return(
        <>
         <Title>Anonymice</Title>
        <Title level={4} type="secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Title>
        <Button 
          style={{ marginTop: '20px'}}
          className={"mt-2"} 
          type="primary">
            Find your next mice
        </Button><br></br>
          <Image
            style={{ marginTop: '100px'}}
            src={`${process.env.PUBLIC_URL}/img/marketmice.png`}
          />
        </>
    );
}
  
export default ContentHeader;


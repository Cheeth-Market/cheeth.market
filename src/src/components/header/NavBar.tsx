import React, { FC } from 'react';
import { Button, Dropdown, PageHeader } from 'antd';
import { Menu} from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';



const DropdownMenu = () => (
    <Dropdown key="more" overlay={menu}>
      <Button
        style={{
          border: 'none',
          padding: 0,
        }}
      >
        <EllipsisOutlined
          style={{
            fontSize: 20,
            verticalAlign: 'top',
          }}
        />
      </Button>
    </Dropdown>
  );
  
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="">
          Official Site
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="">
          Stake
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="">
          ???
        </a>
      </Menu.Item>
    </Menu>
  );

function NavBar() {
    return(
        <PageHeader
        ghost={false}
        title="Anonymice"
        subTitle="Marketplace"
        extra={[
          <Button key="2">List your Mice</Button>,
          <Button key="1" type="primary">
            Connect
          </Button>,
           <DropdownMenu key="more" />,
        ]}
      >
      </PageHeader>
    );
}
  
export default NavBar;


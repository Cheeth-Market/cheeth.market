import React from "react";
import { Button, Dropdown, PageHeader } from "antd";
import { Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import WalletButton from "./WalletButton";




const DropdownMenu = () => (
  <Dropdown key="more" overlay={menu}>
    <Button
      style={{
        border: "none",
        padding: 0,
      }}
    >
      <EllipsisOutlined
        style={{
          fontSize: 20,
          verticalAlign: "top",
        }}
      />
    </Button>
  </Dropdown>
);

const menu = (
  <Menu>
    <Menu.Item key="official">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://etherscan.io/address/0xbad6186e92002e312078b5a1dafd5ddf63d3f731#code"
      >
        Official Site
      </a>
    </Menu.Item>
    <Menu.Item key="staking">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://anonymicestaker.0xinuarashi.dev/"
      >
        Stake
      </a>
    </Menu.Item>
  </Menu>
);

function NavBar() {
  return (
    <PageHeader
      ghost={false}
      title="Anonymarket"
      subTitle=""
      extra={[
      <WalletButton key="wallet" />, 
      <DropdownMenu key="more" />]}
    ></PageHeader>
  );
}

export default NavBar;

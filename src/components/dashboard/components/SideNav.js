/* eslint-disable max-lines-per-function */
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './SideNav.css';
import { VOTERIGHT, MENU } from '../constants';

const { Sider } = Layout;

/**
 * Component for showing side navigation
 *
 * @component
 * @return {jsx} - left side navifation
 */
const SideNav = () => (
    <Sider
        className="sideNav"
        breakpoint="lg"
        collapsedWidth="0"
    >
        <div className="sideNav__top">
            <Link to="/">
                <span className="sideNav__topLogo --font-style">{VOTERIGHT}</span>
            </Link>
        </div>
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['']}
            className="menu"
        >
            {Object.keys(MENU).map(key => {
                const [name, route] = MENU[key];
                return (
                    <Menu.Item key={key} className="sideNav__sideitem">
                        <Link to={`/dashboard/${route}`}>
                            <span className="nav-text">{name}</span>
                        </Link>
                    </Menu.Item>
                );
            })}
        </Menu>
    </Sider>
);

export default SideNav;
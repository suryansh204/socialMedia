import React, { useContext, useState } from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from "../context/auth";
import ThemeSwitch from './ThemeSwitch';
import useWindowDimensions from '../utils/useWindowDimensions';

function MenuBar({ onChange, checked }) {
    const { height, width } = useWindowDimensions();
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substring(1);

    const [activeItem, setActiveItem] = useState(path);

    function handleItemClick(e, { name }) {
        setActiveItem(name)
    };

    function logoutHandler() {
        logout();
        navigate('/');
        setActiveItem('home');
    }

    // After login or register, set Menu Bar active item to home
    if (user && (activeItem === 'login' || activeItem === 'register')) {
        setActiveItem('home');
    }

    return (
        <div className="menu-bar-container">
            {user ? (
                <Menu className='responsive-menu' pointing secondary size='massive' color='teal'>
                    <Menu.Item
                        name={user.username}
                        active={activeItem === `home`}
                        onClick={() => setActiveItem('home')}
                        as={Link}
                        to='/'
                    />

                    {width < 525 ? (
                        <Menu.Menu position='right'>

                            <Menu.Item >
                                <ThemeSwitch onChange={onChange} checked={checked} />
                            </Menu.Item>

                            <Dropdown item icon='bars'>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        text='Profile'
                                        active={activeItem === 'profile'}
                                        onClick={handleItemClick}
                                        as={Link}
                                        to={`/profiles/${user.username}`}
                                    />
                                    <Dropdown.Item
                                        text='Logout'
                                        onClick={logoutHandler}
                                    />
                                </Dropdown.Menu>

                            </Dropdown>
                        </Menu.Menu>

                    ) : (
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <ThemeSwitch onChange={onChange} checked={checked} />
                            </Menu.Item>

                            <Menu.Item
                                name='profile'
                                active={activeItem === 'profile'}
                                onClick={handleItemClick}
                                as={Link}
                                to={`/profiles/${user.username}`}
                            />
                            <Menu.Item
                                name='logout'
                                onClick={logoutHandler}
                            />
                        </Menu.Menu>
                    )}

                </Menu>
            ) : (
                <Menu pointing secondary size='massive' color='teal'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/'
                    />

                    {width < 525 ? (
                        <Menu.Menu position='right'>

                            <Menu.Item>
                                <ThemeSwitch onChange={onChange} checked={checked} />
                            </Menu.Item>

                            <Dropdown item icon='bars'>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        text='Login'
                                        active={activeItem === 'login'}
                                        onClick={handleItemClick}
                                        as={Link}
                                        to='/login'
                                    />
                                    <Dropdown.Item
                                        text='Register'
                                        active={activeItem === 'register'}
                                        onClick={handleItemClick}
                                        as={Link}
                                        to='/register'
                                    />
                                </Dropdown.Menu>
                            </Dropdown>



                        </Menu.Menu>
                    ) : (
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <ThemeSwitch onChange={onChange} checked={checked} />
                            </Menu.Item>

                            <Menu.Item
                                name='login'
                                active={activeItem === 'login'}
                                onClick={handleItemClick}
                                as={Link}
                                to='/login'
                            />
                            <Menu.Item
                                name='register'
                                active={activeItem === 'register'}
                                onClick={handleItemClick}
                                as={Link}
                                to='/register'
                            />
                        </Menu.Menu>
                    )}



                </Menu>
            )
            }
        </div >
    )
}

export default MenuBar;

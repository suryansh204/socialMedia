import React from 'react';
import { Checkbox, Icon } from 'semantic-ui-react';

function ThemeSwitch({ onChange, checked }) {
    return (
        <>
            <Icon name='sun' style={{margin: '0'}}/>
            <Checkbox className='theme-toggle-button' onChange={onChange} checked={checked} toggle />
            <Icon name='moon' style={{margin: '0'}}/>
        </>
    );
}

export default ThemeSwitch;
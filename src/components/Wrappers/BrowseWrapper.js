import React from 'react';
import Browse from '../Browse/Browse';
import { Route, Switch, Redirect } from 'react-router-dom';
import Constants from '../../common/constants';

const BrowseWrapper = (props) => {

    let activeItemIndex = -1;
    let urlObject = props.location.pathname.split('/');

    if (urlObject.length < 4) {
        Constants.BROWSE_ROUTES.map(item => {
            if (item.NAME == urlObject[2]) activeItemIndex = item.INDEX;
        });
    } 
    return (
        <Browse {...Object.assign({}, props, { activeItemIndex : activeItemIndex })} />
    )
}

export default BrowseWrapper;
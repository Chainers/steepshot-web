import React from 'react';

const TabWrapper = (props) => 

<div>
    {props.children.map((child, index) => React.cloneElement(child, {...child.props, isComponentVisible : props.isComponentVisible}))}
</div>


export default TabWrapper;
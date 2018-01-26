import React from 'react';

const TabWrapper = (props) =>
  <div>
    {
      props.children.map((child, index) =>
        child === undefined ? null :
          React.cloneElement(child, {
            ...child.props,
            key: index,
            isComponentVisible: props.isComponentVisible,
          }))
    }
  </div>;

export default TabWrapper;

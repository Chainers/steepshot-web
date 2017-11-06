import React from 'react';

class TabsWrapper extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.children == this.props.children) return false;
        this.setState({
            ...nextProps
        });
        return true;
    }

    renderTabs() {
        let tabs = [];
        let activeTab = this.props.activeTab;
        this.props.children.map((child, index) => {
            let styles = 'tab-pane fade';
            
            if (index == activeTab) {
                styles = 'tab-pane fade in active';
            }

            tabs.push(                
                <div id={"tab-" + index} role="tabpanel" className={styles} key={index}>
                    {child}
                </div>
            );
        });
        return tabs;
    }

    render() {
        return(
            <div className="tab-content">
                {this.renderTabs()}
            </div>
        );
    }
}

export default TabsWrapper;
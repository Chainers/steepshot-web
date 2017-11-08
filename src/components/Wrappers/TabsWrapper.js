import React from 'react';

class TabsWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : this.props.activeTab
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeTab : nextProps.activeTab
        })
    }

    renderTabs() {
        let activeTab = this.state.activeTab;
        return this.props.children.map((child, index) => {
            let styles = 'tab-pane fade';
            
            if (index == activeTab) {
                styles = 'tab-pane fade in active';
            }

            return (           
                <div id={"tab-" + index} role="tabpanel" className={styles} key={index}>
                    {React.cloneElement(child, { ...child.props, isComponentVisible : index == activeTab})}
                </div>
            );
        });
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
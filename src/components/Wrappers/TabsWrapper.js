import React from 'react';

class TabsWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps
        })
    }

    renderTabs() {
        if (this.state.children == undefined) return null;
        let activeTab = this.state.activeTab;
        return this.state.children.map((child, index) => {
            let styles = 'tab-pane fade';
            if (index == activeTab) {
                styles = 'tab-pane fade active';
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

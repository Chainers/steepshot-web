import React from 'react';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';

class AboutComponent extends React.Component {

  render() {
    return (
        <div className="card-field about">
            <div className="about__heading text--center">
                <HeadingLeadComponent text={<h2>Community guidelines</h2>} />
            </div>
            <div className="about__list">
                <p>We encourage you to follow simple rules when publishing:</p>
                <ol className="styled">
                    <li>All published images should be of high quality.</li>
                    <li>Your content should not be perceived as repulsive and shocking.</li>
                    <li>Publications should not incite hatred and be directed against a social group. Also, one should not publish calls for violence or terrorism.</li>
                    <li>It is undesirable to publish something that has no attributes of authorship. For example, a screenshot of the phone screen.</li>
                    <li>All adult content must be marked by the author by the #nsfw tag. Publication of pornographic content is not allowed and should be flagged.</li>
                    <li>Advertising or fraud is not allowed.</li>
                    <li>You should not publish requests for the transfer of money (for any reason) and negative media (messages in the spirit of "repay it, or it will happen terrible").</li>
                    <li>If you have doubts about your content, refrain from publishing.</li>
                </ol>
            </div>
        </div>
    )
  }
}

export default AboutComponent;

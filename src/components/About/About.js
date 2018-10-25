import React from 'react';
import styled from 'styled-components';

import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';
import { documentTitle } from '../../utils/documentTitle';

const AboutContainer = styled.div`
  margin: 60px auto;
  max-width: 550px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 30px 30px 0 rgba(204, 204, 204, 0.5);
  margin-bottom: 40px;

  @media screen and (min-width: 320px) and (max-width: 420px) {
    margin: 0 !important;
  }
  @media (max-width: 815px) {
    max-width: none !important;
    margin: 0 !important;
  }
`;

const AboutHeading = styled.div`
  padding: 1rem 2rem;
  text-align: center;
`;

const AboutListContainer = styled.div`
  padding: 0 3rem 2rem 3rem;
`;

class About extends React.Component {
  componentWillMount() {
    documentTitle();
  }

  render() {
    return (
      <AboutContainer>
        <AboutHeading>
          <HeadingLeadComponent text={<h2>Community guidelines</h2>} />
        </AboutHeading>
        <AboutListContainer>
          <p>We encourage you to follow simple rules when publishing:</p>
          <ol>
            <li>
              <strong>High Quality. </strong>
              All published images should be of high quality.
            </li>
            <li>
              <strong>No Repulsive content. </strong>
              Your content should not be perceived as repulsive or shocking.
            </li>
            <li>
              <strong>No Hate Speech. </strong>
              Hate speech or “Internet trolling” will not be tolerated. Publications should not
              incite hatred or be directed against a social group. Also, one should not publish
              calls for violence or terrorism.
            </li>
            <li>
              <strong>Authorship. </strong>
              We do not want content with no attributes of authorship. (For example, a screenshot of
              the phone screen displaying someone else’s photo shows it lack uniqueness and
              indicates no form of authorship.) A watermark, original photo, or having yourself in
              the image could all be considered attributes of authorship.
            </li>
            <li>
              <strong>Fraud & Plagiarism Are Not Tolerated. </strong>
              You cannot: request for the transfer of money (for any reason), post anything related
              to scams, use threatening messaging (“upvote me or else I will downvote you” for
              example), or post others’ work and claim it as your own.
            </li>
            <li>
              <strong>NSFW. </strong>
              All adult content must be marked by the author by the
              <strong> #nsfw tag. </strong>
              Publication of pornographic content is not allowed whatsoever.
            </li>
            <li>
              <strong>Unsure? </strong>
              If you have doubts about your content, please refrain from publishing it.
            </li>
          </ol>
          <p>
            We expect users to flag the content that does not follow the rules mentioned above and
            allow ourselves to hide it. Also please direct users to the guidelines here if you find
            someone breaking them.
          </p>
        </AboutListContainer>
      </AboutContainer>
    );
  }
}

export default About;

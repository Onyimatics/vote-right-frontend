/* eslint-disable max-lines-per-function */
import React from 'react';
import PropTypes from 'prop-types';
import './Candidate.css';
import {
    Card, Button, Icon
} from 'antd';
import './ViewCandidates.css';
import {
    AGE_LABEL, PARTY_LABEL, VOTE, EDU_LABEL,
    GOOGLE_SEARCH, YOUTUBE_SEARCH, WIKIPEDIA_SEARCH

} from '../constants';

/**
 * Displays candidate details
 *
 * @function
 *
 * @param {object} - props
 * @return {component} - Candidate component
 */
const Candidate = ({
    id, pictureUrl, name, age, party, handleVote, quote, education,
    selectCandidateToCompare, isSelected,
}) => {
    /**
     * Handles click on vote button
     *
     * @function
     */
    const handleClick = () => {
        handleVote(id);
    };
    /**
     * upon click of the compare button,
     * it disables the button and adds the user to compare
     *
     * @function
     */
    const toggleAndCompare = () => {
        selectCandidateToCompare();
    };
    return (
        <Card
            key={id}
            className="candidateCard"
            cover={(
                <img
                    className="candidateCard__image"
                    src={pictureUrl}
                    alt="candidate_picture"
                />
            )}
            actions={[
                <a
                    className="candidateCard__metaitem"
                    target="_blank"
                    rel="noopener noreferrer"
                    key="lol"
                    href={`${GOOGLE_SEARCH}${name}`}
                >
                    <Icon type="google" />
                </a>,
                <a
                    className="candidateCard__metaitem"
                    target="_blank"
                    rel="noopener noreferrer"
                    key="lol"
                    href={`${WIKIPEDIA_SEARCH}${name.split(' ').join('_')}`}
                >
                    <Icon type="search" />
                </a>,
                <a
                    className="candidateCard__metaitem"
                    target="_blank"
                    rel="noopener noreferrer"
                    key="lol"
                    href={`${YOUTUBE_SEARCH}${name}`}
                >
                    <Icon type="youtube" />
                </a>,
            ]}
        >
            <div className="candidateCard__section">
                <p className="candidateCard__label -header --fontBig">
                    {name}
                </p>
                <Button
                    className={`candidateCard__section__button ${(isSelected)
                        ? '--selected' : ''}
                    `}
                    shape="round"
                    icon="paper-clip"
                    onClick={toggleAndCompare}
                >
                    Compare
                </Button>
            </div>
            <p className="candidateCard__label">
                <Icon className="candidateCard__label__icon" type="user" />
                {`${age} ${AGE_LABEL}`}
            </p>
            <p className="candidateCard__label">
                <Icon className="candidateCard__label__icon" type="usergroup-add" />
                {`${PARTY_LABEL} ${party.slice(0, 3)}`}
            </p>
            <p className="candidateCard__label">
                <Icon className="candidateCard__label__icon" type="book" />
                {`${EDU_LABEL} ${education.slice(0, 10)}`}
            </p>
            <p className="candidateCard__label --center">
                <Icon type="sound" />
                <i>{`'${quote}'`}</i>
            </p>
            <Button
                type="primary"
                className="candidateCard__vote"
                onClick={handleClick}
            >
                <Icon
                    className="electionItem__subitem__icon"
                    type="check"
                    key="check"
                />
                {VOTE}
            </Button>
        </Card>
    );
};
export default Candidate;

Candidate.propTypes = {
    age: PropTypes.string.isRequired,
    education: PropTypes.string.isRequired,
    handleVote: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    party: PropTypes.string.isRequired,
    pictureUrl: PropTypes.string.isRequired,
    quote: PropTypes.string.isRequired,
    selectCandidateToCompare: PropTypes.func.isRequired,
};

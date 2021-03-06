/* eslint-disable max-lines-per-function */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Icon, Spin, Table, Avatar
} from 'antd';
import PropTypes from 'prop-types';
import { actions } from '../../viewStats';
import {
    LOADING_MESSAGE, NO_CANDIDATE
} from '../constants';
import Particles from '../../particleBackground';

const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);

const columns = [
    {
        dataIndex: 'name',
        render(text, record) {
            return (
                <div className="tableNameCol">
                    <Avatar
                        src={record.pictureLink}
                        className="--paddingleft"
                    />
                    <div className="tableNameCol__text">
                        {text}
                    </div>
                </div>
            );
        },
        title: 'Name',
    },
    {
        dataIndex: 'party',
        ellipsis: true,
        title: 'Party',
    },
    {
        dataIndex: 'age',
        title: 'Age',
    },
    {
        dataIndex: 'education',
        title: 'Education',
    },

];

export default function ViewResults({ address }) {
    // get the state variables
    const candidates = useSelector(state => state.candidates);
    const loading = useSelector(state => state.candidatesLoading);
    // dispatch the loadCandidates saga
    // which has been defined in the viewstats component
    const dispatch = useDispatch();
    // sort the candidates by votecount
    const sortedCandidate = candidates.sort((a, b) => b.voteCount - a.voteCount);
    useEffect(() => {
        dispatch(actions.pushCandidates([]));
        dispatch(actions.loadingCandidates(true));
        dispatch(actions.loadCandidates(address));
    }, [dispatch, address]);
    // item for customising the spinner
    const antIcon = <Icon type="loading" className="loader" spin />;
    return (
        <div className="viewCandidates --noPadding">
            <Particles />
            <Spin
                size="large"
                indicator={antIcon}
                spinning={loading}
                className="loader"
                tip={LOADING_MESSAGE}
            />
            {
                // if there is no candidateloading  then show that there is none.
                (candidates.length === 0 && !loading) ? (
                    <div className="no_candidate">
                        {NO_CANDIDATE}
                    </div>
                )
                    : ''
            }
            {
                // if there is at least one candidate and we are done loading
                // then show the table
                (!loading && candidates.length > 0) ? (
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={sortedCandidate}
                        expandedRowRender={record => <i>{`'${record.quote}'`}</i>}
                    />
                ) : ''
            }
        </div>
    );
}

ViewResults.propTypes = {
    address: PropTypes.string.isRequired,
};

IconText.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};


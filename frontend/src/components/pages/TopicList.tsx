import React from "react";
import { Table, Empty, Skeleton, Checkbox } from "antd";
import { observer } from "mobx-react";

import { api } from "../../state/backendApi";
import { uiSettings } from "../../state/ui";
import { PageComponent, PageInitHelper } from "./Page";
import { CompareFn } from "antd/lib/table";
import { PaginationConfig } from "antd/lib/pagination";
import { NavLink } from "react-router-dom";
import { makePaginationConfig, sortField } from "../common";
import { appGlobal } from "../..";
import { motion } from "framer-motion";
import { animProps } from "../../utils/animationProps";


@observer
class TopicList extends PageComponent {

    pageConfig = makePaginationConfig();

    initPage(p: PageInitHelper): void {
        p.title = 'Topics';
        p.addBreadcrumb('Topics', '/topics');
        p.extraContent = () => <>
            <Checkbox
                checked={uiSettings.topics.hideInternalTopics}
                onChange={e => uiSettings.topics.hideInternalTopics = e.target.checked}
            >Hide internal topics</Checkbox>
        </>

        api.refreshTopics();
    }

    render() {
        if (!api.Topics) return this.skeleton;
        if (api.Topics.length == 0) return <Empty />

        const topics = api.Topics.filter(t => uiSettings.topics.hideInternalTopics && t.isInternal ? false : true);

        return (
            <motion.div {...animProps}>
                <Table
                    style={{ margin: '0', padding: '0' }} bordered={true} size={'middle'}
                    onRow={(record, rowIndex) =>
                        ({
                            onClick: event => appGlobal.history.push('/topics/' + record.topicName),
                        })}
                    rowClassName={() => 'hoverLink'}
                    pagination={this.pageConfig}
                    dataSource={topics}
                    rowKey={x => x.topicName}
                    columns={[
                        { title: 'Name', dataIndex: 'topicName', sorter: sortField('topicName') },
                        { title: 'Partitions', dataIndex: 'partitionCount', sorter: sortField('partitionCount'), width: 1 },
                        { title: 'Replication', dataIndex: 'replicationFactor', width: 1 },
                        { title: 'CleanupPolicy', dataIndex: 'cleanupPolicy', width: 1 },
                    ]} />
            </motion.div>
        );
    }

    skeleton = <>
        <motion.div {...animProps} key={'loader'}>
            <Skeleton loading={true} active={true} paragraph={{ rows: 8 }} />
        </motion.div>
    </>
}

export default TopicList;

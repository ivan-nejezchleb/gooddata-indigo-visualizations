import 'fixed-data-table/dist/fixed-data-table.css';
import '../styles/table.scss';

import React, { Component, PropTypes } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2';
import Dimensions from 'react-dimensions';
import classNames from 'classnames';
import { noop, partial, uniqueId } from 'lodash';

import Bubble from 'goodstrap/packages/Bubble/ReactBubble';
import TableSortBubbleContent from './TableSortBubbleContent';

import {
    getNextSortDir,
    getColumnAlign,
    getStyledLabel,
    getCellClassNames,
    getHeaderClassNames,
    getHeaderSortClassName,
    getTooltipSortAlignPoints,
    calculateArrowPositions
} from './utils';

const MIN_COLUMN_WIDTH = 100;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;
export const DEFAULT_ROW_HEIGHT = 30;
export const DEFAULT_HEADER_HEIGHT = 26;

export class TableVisualization extends Component {
    static propTypes = {
        containerWidth: PropTypes.number.isRequired,
        containerHeight: PropTypes.number,
        containerMaxHeight: PropTypes.number,
        hasHiddenRows: PropTypes.bool,
        rows: PropTypes.array.isRequired,
        headers: PropTypes.array.isRequired,
        sortInTooltip: PropTypes.bool,
        sortDir: PropTypes.string,
        sortBy: PropTypes.number,
        onSortChange: PropTypes.func
    };

    static defaultProps = {
        rows: [],
        headers: [],
        onSortChange: noop,
        sortInTooltip: false
    };

    constructor() {
        super();
        this.state = {
            hintSortBy: null,
            sortBubble: {
                visible: false
            }
        };

        this.renderTooltipHeader = this.renderTooltipHeader.bind(this);
        this.renderDefaultHeader = this.renderDefaultHeader.bind(this);
        this.setTableRef = this.setTableRef.bind(this);
        this.setTableWrapRef = this.setTableWrapRef.bind(this);
        this.closeBubble = this.closeBubble.bind(this);
    }

    setTableRef(ref) {
        this.tableRef = ref;
    }

    setTableWrapRef(ref) {
        this.tableWrapRef = ref;
    }

    getSortFunc(column, index) {
        const { onSortChange } = this.props;
        return partial(onSortChange, column, index);
    }

    getSortObj(column, index) {
        const { sortBy, sortDir } = this.props;
        const { hintSortBy } = this.state;

        const dir = (sortBy === index ? sortDir : null);
        const nextDir = getNextSortDir(column, dir);

        return {
            dir,
            nextDir,
            sortDirClass: getHeaderSortClassName(hintSortBy === index ? nextDir : dir)
        };
    }

    closeBubble() {
        this.setState({
            sortBubble: {
                visible: false
            }
        });
    }

    isBubbleVisible(index) {
        const { sortBubble } = this.state;
        return sortBubble.visible && sortBubble.index === index;
    }

    renderTooltipHeader(column, index, columnWidth) {
        const headerClasses = getHeaderClassNames(column);
        const bubbleClass = uniqueId('table-header-');
        const cellClasses = classNames(headerClasses, bubbleClass);

        const sort = this.getSortObj(column, index);

        const columnAlign = getColumnAlign(column);
        const alignPoints = getTooltipSortAlignPoints(columnAlign);

        const getArrowPositions = () => {
            return calculateArrowPositions({
                width: columnWidth,
                align: columnAlign,
                index
            }, this.tableRef.state.scrollX, this.tableWrapRef);
        };

        const showSortBubble = () => {
            this.setState({
                sortBubble: {
                    visible: true,
                    index
                }
            });
        };

        return props => (
            <span>
                <Cell {...props} className={cellClasses} onClick={showSortBubble}>
                    <span className="gd-table-header-title">
                        {column.title}
                    </span>
                    <span className={sort.sortDirClass} />
                </Cell>
                {this.isBubbleVisible(index) &&
                    <Bubble
                        closeOnOutsideClick
                        alignTo={`.${bubbleClass}`}
                        className="gd-table-header-bubble bubble-light"
                        overlayClassName="gd-table-header-bubble-overlay"
                        alignPoints={alignPoints}
                        arrowDirections={{ 'bl tr': 'top', 'br tl': 'top' }}
                        arrowOffsets={{ 'bl tr': [11, 7], 'br tl': [-11, 7] }}
                        arrowStyle={getArrowPositions}
                        onClose={this.closeBubble}
                    >
                        <TableSortBubbleContent
                            activeSortDir={sort.dir}
                            title={column.title}
                            onClose={this.closeBubble}
                            onSortChange={this.getSortFunc(column, index)}
                        />
                    </Bubble>
                }
            </span>
        );
    }

    renderDefaultHeader(column, index) {
        const headerClasses = getHeaderClassNames(column);

        const sort = this.getSortObj(column, index);
        const sortFunc = this.getSortFunc(column, index);

        const onClick = e => sortFunc(sort.nextDir, e);
        const onMouseEnter = () => this.setState({ hintSortBy: index });
        const onMouseLeave = () => this.setState({ hintSortBy: null });

        return props => (
            <Cell
                {...props}
                className={headerClasses}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <span className="gd-table-header-title">{column.title}</span>
                <span className={sort.sortDirClass} />
            </Cell>
        );
    }

    renderCell(column, index) {
        const { sortBy } = this.props;
        const isSorted = sortBy === index;
        return props => {
            const { rowIndex, columnKey } = props;

            const content = this.props.rows[rowIndex][columnKey];
            const classes = getCellClassNames(rowIndex, columnKey, isSorted);

            const { style, label } = getStyledLabel(column, content);

            return (
                <Cell {...props}>
                    <span className={classes} style={style}>{label}</span>
                </Cell>
            );
        };
    }

    renderColumns(columnWidth) {
        const renderHeader =
            this.props.sortInTooltip ? this.renderTooltipHeader : this.renderDefaultHeader;

        return this.props.headers.map((column, index) => {
            return (
                <Column
                    key={`${index}.${column.id}`}
                    width={columnWidth}
                    align={getColumnAlign(column)}
                    columnKey={index}
                    header={renderHeader(column, index, columnWidth)}
                    cell={this.renderCell(column, index)}
                    allowCellsRecycling
                />
            );
        });
    }

    render() {
        let { headers, containerWidth, containerHeight, containerMaxHeight } = this.props;
        let columnWidth = Math.max(containerWidth / headers.length, MIN_COLUMN_WIDTH);

        const height = !!containerMaxHeight ? undefined : containerHeight || DEFAULT_HEIGHT;
        const tableComponentClasses = classNames(
            'indigo-table-component',
            {
                'has-hidden-rows': this.props.hasHiddenRows
            }
        );

        return (
            <div className={tableComponentClasses}>
                <div className="indigo-table-component-content" ref={this.setTableWrapRef}>
                    <Table
                        ref={this.setTableRef}
                        touchScrollEnabled
                        headerHeight={DEFAULT_HEADER_HEIGHT}
                        rowHeight={DEFAULT_ROW_HEIGHT}
                        rowsCount={this.props.rows.length}
                        width={containerWidth || DEFAULT_WIDTH}
                        maxHeight={containerMaxHeight}
                        height={height}
                        onScrollStart={this.closeBubble}
                    >
                        {this.renderColumns(columnWidth)}
                    </Table>
                </div>
            </div>
        );
    }
}

export default Dimensions()(TableVisualization); // eslint-disable-line new-cap

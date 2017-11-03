// @flow
/* eslint-disable import/no-extraneous-dependencies */
/* global document */

import * as React from 'react';
import ReactDOM from 'react-dom';
import Slate, { type Node } from 'slate';
import { Editor } from 'slate-react';

import PluginEditTable from '../lib/';
import valueJson from './value.json';

const tablePlugin = PluginEditTable();
const plugins = [tablePlugin];

type NodeProps = {
    attributes: Object,
    node: Node,
    children: React.Node
};

const schema = {
    nodes: {
        table: (props: NodeProps) => (
            <table>
                <tbody {...props.attributes}>{props.children}</tbody>
            </table>
        ),
        table_row: (props: NodeProps) => (
            <tr {...props.attributes}>{props.children}</tr>
        ),
        table_cell: (props: NodeProps) => {
            const align = props.node.get('data').get('align') || 'left';
            return (
                <td style={{ textAlign: align }} {...props.attributes}>
                    {props.children}
                </td>
            );
        },
        paragraph: (props: NodeProps) => (
            <p {...props.attributes}>{props.children}</p>
        ),
        heading: (props: NodeProps) => (
            <h1 {...props.attributes}>{props.children}</h1>
        )
    }
};

const Example = React.createClass({
    getInitialState() {
        return {
            value: Slate.State.fromJSON(valueJson)
        };
    },

    onChange({ value }) {
        this.setState({
            value
        });
    },

    onInsertTable() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.insertTable(value.change()));
    },

    onInsertColumn() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.insertColumn(value.change()));
    },

    onInsertRow() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.insertRow(value.change()));
    },

    onRemoveColumn() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.removeColumn(value.change()));
    },

    onRemoveRow() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.removeRow(value.change()));
    },

    onRemoveTable() {
        const { value } = this.state;

        this.onChange(tablePlugin.changes.removeTable(value.change()));
    },

    onSetAlign(event, align) {
        const { value } = this.state;

        this.onChange(
            tablePlugin.changes.setColumnAlign(value.change(), align)
        );
    },

    renderNormalToolbar() {
        return (
            <div>
                <button onClick={this.onInsertTable}>Insert Table</button>
            </div>
        );
    },

    renderTableToolbar() {
        return (
            <div>
                <button onClick={this.onInsertColumn}>Insert Column</button>
                <button onClick={this.onInsertRow}>Insert Row</button>
                <button onClick={this.onRemoveColumn}>Remove Column</button>
                <button onClick={this.onRemoveRow}>Remove Row</button>
                <button onClick={this.onRemoveTable}>Remove Table</button>
                <br />
                <button onClick={e => this.onSetAlign(e, 'left')}>
                    Set align left
                </button>
                <button onClick={e => this.onSetAlign(e, 'center')}>
                    Set align center
                </button>
                <button onClick={e => this.onSetAlign(e, 'right')}>
                    Set align right
                </button>
            </div>
        );
    },

    render() {
        const { value } = this.state;
        const isTable = tablePlugin.utils.isSelectionInTable(value);

        return (
            <div>
                {isTable
                    ? this.renderTableToolbar()
                    : this.renderNormalToolbar()}
                <Editor
                    placeholder={'Enter some text...'}
                    plugins={plugins}
                    value={value}
                    onChange={this.onChange}
                    schema={schema}
                />
            </div>
        );
    }
});

// $FlowFixMe
ReactDOM.render(<Example />, document.getElementById('example'));
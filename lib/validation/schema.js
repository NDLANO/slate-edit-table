// @flow

import { type Change } from 'slate';
import {
    CHILD_TYPE_INVALID,
    PARENT_TYPE_INVALID,
} from './slate-schema-violations';
import { createCell } from '../utils';
import type Options from '../options';

/*
 * Returns a schema definition for the plugin
 */
function schema(opts: Options): Object {
    return {
        blocks: {
            [opts.typeTable]: {
                nodes: [{ match: { type: opts.typeRow } }],
                first: {
                    match: {
                        type: opts.typeRow,
                        isHeader: true,
                    },
                },
                normalize(change: Change, error) {
                    switch (error.code) {
                        case 'first_child_type_invalid':
                            return change.setNodeByKey(error.node, {
                                data: { ...error.node.data, isHeader: true },
                            });
                        default:
                            return undefined;
                    }
                },
            },
            [opts.typeRow]: {
                nodes: [{ match: { type: opts.typeCell } }],
                parent: { type: opts.typeTable },
                normalize(change: Change, error) {
                    switch (error.code) {
                        case CHILD_TYPE_INVALID:
                            return onlyCellsInRow(opts, change, error);
                        case PARENT_TYPE_INVALID:
                            return rowOnlyInTable(opts, change, error);
                        default:
                            return undefined;
                    }
                },
            },
            [opts.typeCell]: {
                parent: { type: opts.typeRow },
                normalize(change: Change, error) {
                    switch (error.code) {
                        case PARENT_TYPE_INVALID:
                            return cellOnlyInRow(opts, change, error);
                        default:
                            return undefined;
                    }
                },
            },
        },
    };
}

/*
 * A row's children must be cells.
 * If they're not then we wrap them within a cell.
 */
function onlyCellsInRow(opts: Options, change: Change, error) {
    const cell = createCell(opts, []);
    const index = error.node.nodes.findIndex(
        child => child.key === error.child.key,
    );

    change.withoutNormalizing(() => {
        change.withoutSaving(() => {
            change.insertNodeByKey(error.node.key, index, cell);
            change.moveNodeByKey(error.child.key, cell.key, 0);
        });
    });
}

/*
 * Rows can't live outside a table, if one is found then we wrap it within a table.
 */
function rowOnlyInTable(opts: Options, change: Change, error: Object) {
    change.withoutSaving(() =>
        change.wrapBlockByKey(error.node.key, opts.typeTable),
    );
}

/*
 * Cells can't live outside a row, if one is found then we wrap it within a row.
 */
function cellOnlyInRow(opts: Options, change: Change, error: Object) {
    change.withoutSaving(() =>
        change.wrapBlockByKey(error.node.key, opts.typeRow),
    );
}

export default schema;

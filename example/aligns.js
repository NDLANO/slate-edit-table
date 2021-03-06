// @flow
import { type Change } from 'slate';
import { NODE_DATA_INVALID } from '../lib/validation/slate-schema-violations';
import PluginEditTable from '../lib/';

/*
 * This file contains an example of cell align management extension.
 */

const tablePlugin = PluginEditTable({
    typeTable: 'table',
    typeRow: 'table_row',
    typeCell: 'table_cell',
    typeContent: 'paragraph',
});

/*
 * Set align data for the current column
 */
function setColumnAlign(editor: Change, align: string): Change {
    const pos = tablePlugin.utils.getPosition(editor.value);
    const columnCells = tablePlugin.utils.getCellsAtColumn(
        pos.table,
        pos.getColumnIndex(),
    );
    columnCells.forEach(cell => {
        editor.setNodeByKey(cell.key, { data: { align } });
    });
    return editor;
}

const alignPlugin = {
    schema: {
        blocks: {
            table_cell: {
                data: {
                    // Make sure cells have an alignment
                    align: (align: string) =>
                        ['left', 'center', 'right'].includes(align),
                },
                normalize(change: Change, violation: string, context: Object) {
                    if (violation === NODE_DATA_INVALID) {
                        change.setNodeByKey(context.node.key, {
                            data: context.node.data.set('align', 'left'),
                        });
                    }
                },
            },
        },
    },

    changes: {
        setColumnAlign,
    },
};

export default alignPlugin;

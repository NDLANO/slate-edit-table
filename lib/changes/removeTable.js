// @flow
import { type Change } from 'slate';

import type Options from '../options';
import removeTableByKey from './removeTableByKey';

/**
 * Delete the whole table at position
 */
function removeTable(opts: Options, editor: Change): Change {
    const { value } = editor;
    const { selection } = value;

    return removeTableByKey(opts, editor, selection.start.key);
}

export default removeTable;

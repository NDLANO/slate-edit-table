import expect from 'expect';

export default function(editor) {
    const cursorBlock = editor.value.document.getDescendant('anchor');
    editor.moveToRangeOfNode(cursorBlock);

    const initialPosition = editor.getTablePosition(editor.value);

    editor.run('onKeyDown',
        {
            key: 'Tab',
            preventDefault() {},
            stopPropagation() {},
        },
        editor,
    );

    const position = editor.getTablePosition(editor.value);

    // Next row
    expect(position.getRowIndex()).toEqual(initialPosition.getRowIndex() + 1);
    // Moved to first column
    expect(position.getColumnIndex()).toEqual(0);

    return editor;
}

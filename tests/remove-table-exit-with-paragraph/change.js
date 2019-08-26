import expect from 'expect';

export default function(editor) {
    editor.focus();
    const { value } = editor;
    const cursorBlock = value.selection.start;

    editor.removeTable(editor);

    expect(value.document.getParent(cursorBlock.path).type).toEqual(
        'paragraph',
    );

    return editor;
}

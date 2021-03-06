export default function(editor) {
    const cursorBlock = editor.value.document.getDescendant('anchor');
    editor.moveToRangeOfNode(cursorBlock);

    return editor.removeTable(editor);
}

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const TextEditor = (props) => {
    const { data, onChangeData,onEditorReady, ...rest } = props;
    return (
        <CKEditor
            editor={Editor}
            data={data}
            onReady={(editor) => {
                onEditorReady(editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChangeData(data);
            }}
            {...rest}
        />
    );
};

export default TextEditor;

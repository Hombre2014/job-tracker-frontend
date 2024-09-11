import { useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  Editor,
  BtnUndo,
  BtnRedo,
  createButton,
  EditorProvider,
  BtnStrikeThrough,
  Separator,
  Toolbar,
  BtnBulletList,
  BtnNumberedList,
  BtnLink,
} from 'react-simple-wysiwyg';

const TextEditor = () => {
  const [html, setHtml] = useState('my <b>HTML</b>');
  const handleDescription = (e: any) => {
    setHtml(e.target.value);
    console.log(e.target.value);
  };

  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');
  const BtnAlignRight = createButton('Align right', '⟞', 'justifyRight');
  const BtnAlignLeft = createButton('Align left', '⟝', 'justifyLeft');

  return (
    <div className="flex gap-2">
      <div className="space-y-1 w-full">
        <Label htmlFor="description">Description</Label>
        <EditorProvider>
          <Editor
            id="description"
            value={html}
            onChange={handleDescription}
            containerProps={{
              style: { resize: 'vertical' },
            }}
          >
            <Toolbar>
              <BtnUndo />
              <BtnRedo />
              <Separator />
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <BtnStrikeThrough />
              <Separator />
              <BtnAlignLeft />
              <BtnAlignCenter />
              <BtnAlignRight />
              <Separator />
              <BtnBulletList />
              <BtnNumberedList />
              <BtnLink />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>
    </div>
  );
};

export default TextEditor;

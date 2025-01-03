import { useState } from 'react';
import {
  Editor,
  BtnBold,
  Toolbar,
  BtnUndo,
  BtnRedo,
  BtnLink,
  BtnStyles,
  BtnItalic,
  Separator,
  HtmlButton,
  BtnUnderline,
  createButton,
  BtnBulletList,
  EditorProvider,
  BtnNumberedList,
  BtnStrikeThrough,
} from 'react-simple-wysiwyg';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const TextEditor = ({
  id,
  title,
  value,
  backColor,
  initialText,
  buttonVisibility,
  sendData,
}: TextEditorProps) => {
  const [html, setHtml] = useState(value || initialText);
  const handleDescription = (e: any) => {
    setHtml(e.target.value);
  };

  const BtnAlignLeft = createButton('Align left', '⟝', 'justifyLeft');
  const BtnAlignRight = createButton('Align right', '⟞', 'justifyRight');
  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');

  const handleBlur = () => {
    if (sendData) {
      sendData(id as keyof JobApplication, html!);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="space-y-1 w-full">
        <Label htmlFor="description">{title}</Label>
        <EditorProvider>
          <Editor
            id={id}
            value={html}
            style={{ backgroundColor: `${backColor}` }}
            onChange={handleDescription}
            onBlur={handleBlur}
            containerProps={{
              style: {
                resize: 'vertical',
                minHeight: '200px',
                maxHeight: '280px',
                overflow: 'auto',
              },
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
              <BtnNumberedList />
              <BtnBulletList />
              <Separator />
              <BtnLink />
              <HtmlButton />
              <Separator />
              <BtnStyles />
            </Toolbar>
          </Editor>
          <Button
            variant="normal"
            onClick={() => console.log('The value in TextEditor: ', html)}
            className={cn(
              'relative bottom-[20%] left-[90%] hover:bg-blue-600 cursor-pointer',
              buttonVisibility ? 'block' : 'hidden'
            )}
          >
            Save
          </Button>
        </EditorProvider>
      </div>
    </div>
  );
};

export default TextEditor;

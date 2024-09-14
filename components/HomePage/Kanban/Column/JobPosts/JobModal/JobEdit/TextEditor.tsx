import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  HtmlButton,
  BtnStyles,
} from 'react-simple-wysiwyg';
import { cn } from '@/lib/utils';

const TextEditor = ({
  backColor,
  initialText,
  title,
  buttonVisibility,
}: {
  backColor?: string;
  initialText?: string;
  title?: string;
  buttonVisibility?: boolean;
}) => {
  const [html, setHtml] = useState(initialText);
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
        <Label htmlFor="description">{title}</Label>
        <EditorProvider>
          <Editor
            id="description"
            value={html}
            style={{ backgroundColor: `${backColor}` }}
            onChange={handleDescription}
            containerProps={{
              style: { resize: 'vertical', minHeight: '200px' },
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
            onClick={() => console.log(html)}
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

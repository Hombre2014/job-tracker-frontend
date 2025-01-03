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
  sendData,
  backColor,
  placeholder,
  buttonVisibility,
}: TextEditorProps) => {
  const [html, setHtml] = useState(
    value || placeholder || 'Add a note here...'
  );
  const [isPlaceholder, setIsPlaceholder] = useState(!value);

  const handleDescription = (e: any) => {
    setHtml(e.target.value);
  };

  const BtnAlignLeft = createButton('Align left', '⟝', 'justifyLeft');
  const BtnAlignRight = createButton('Align right', '⟞', 'justifyRight');
  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');

  const handleFocus = () => {
    if (isPlaceholder) {
      setHtml('');
      setIsPlaceholder(false);
    }
  };

  const handleBlur = () => {
    if (!html) {
      setHtml(placeholder || 'Add a note here...');
      setIsPlaceholder(true);
    }
    if (sendData) {
      sendData(id as keyof JobApplication, html!);
    }
  };

  const handleSave = () => {
    setHtml(placeholder || 'Add a note here...');
    setIsPlaceholder(true);
  };

  return (
    <div className="flex gap-2">
      <div className="space-y-1 w-full">
        <Label htmlFor="description">{title}</Label>
        <EditorProvider>
          <Editor
            id={id}
            value={html}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleDescription}
            style={{ backgroundColor: `${backColor}` }}
            containerProps={{
              style: {
                overflow: 'auto',
                resize: 'vertical',
                minHeight: '200px',
                maxHeight: '280px',
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
            onClick={handleSave}
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

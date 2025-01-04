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
  autoSave,
  backColor,
  placeholder,
  buttonVisibility,
}: TextEditorProps) => {
  const [html, setHtml] = useState(value || '');
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const BtnAlignLeft = createButton('Align left', '⟝', 'justifyLeft');
  const BtnAlignRight = createButton('Align right', '⟞', 'justifyRight');
  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');

  const handleDescription = (e: any) => {
    setHtml(e.target.value);
    setShowPlaceholder(false);
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  // const handleBlur = () => {
  //   if (!html.trim()) {
  //     setShowPlaceholder(true);
  //   }
  // };

  const handleBlur = () => {
    if (autoSave && sendData) {
      sendData(id as keyof JobApplication, html || value || '');
    }
    setShowPlaceholder(true);
  };

  const handleSave = () => {
    if (sendData && html.trim()) {
      sendData(id as keyof JobApplication, html);
      setHtml('');
      setShowPlaceholder(true);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="space-y-1 w-full">
        <Label htmlFor="description">{title}</Label>
        <EditorProvider>
          <Editor
            id={id}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={handleDescription}
            style={{ backgroundColor: `${backColor}` }}
            value={showPlaceholder && !html ? placeholder : html}
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

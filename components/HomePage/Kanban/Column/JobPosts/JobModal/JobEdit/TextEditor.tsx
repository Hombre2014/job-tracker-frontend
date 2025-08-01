import { debounce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  const { theme } = useTheme();
  const [html, setHtml] = useState(value || '');
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Theme-aware background color
  const getBackgroundColor = () => {
    if (theme === 'dark') {
      return '#1e293b'; // slate-800
    }
    return backColor || '#fefce8'; // yellow-50 as fallback
  };

  const BtnAlignLeft = createButton('Align left', '⟝', 'justifyLeft');
  const BtnAlignRight = createButton('Align right', '⟞', 'justifyRight');
  const BtnAlignCenter = createButton('Align center', '≡', 'justifyCenter');

  // const debouncedSendData = useCallback(
  //   debounce((id: keyof JobApplication, value: string) => {
  //     if (sendData) {
  //       sendData(id, value);
  //     }
  //   }, 500),
  //   [sendData]
  // );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSendData = useCallback(
    debounce((id: keyof JobApplication, value: string) => {
      if (sendData) {
        sendData(id, value);
      }
    }, 500),
    [sendData]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSendData.cancel();
    };
  }, [debouncedSendData]);

  const handleDescription = (e: any) => {
    const newValue = e.target.value;
    setHtml(newValue);
    setShowPlaceholder(false);

    // Auto-save for edit-note (Notes editing) and description (JobInfo)
    if (sendData && (id === 'edit-note' || id === 'description')) {
      debouncedSendData(id as keyof JobApplication, newValue);
    }
  };

  const handleFocus = () => {
    setShowPlaceholder(false);
  };

  const handleBlur = () => {
    const content = html || value || '';
    if (autoSave && sendData && content.trim()) {
      sendData(id as keyof JobApplication, content);
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
          <div onBlur={handleBlur}>
            <Editor
              id={id}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onChange={handleDescription}
              style={{ 
                backgroundColor: getBackgroundColor(),
                color: theme === 'dark' ? '#ffffff' : '#000000'
              }}
              value={showPlaceholder && !html ? placeholder : html}
              containerProps={{
                style: {
                  overflow: 'auto',
                  resize: 'vertical',
                  minHeight: '200px',
                  maxHeight: '280px',
                  marginRight: '1rem',
                },
              }}
            >
              <div className="sticky top-0 z-50 bg-background">
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
              </div>
            </Editor>
          </div>
          <Button
            variant="normal"
            onClick={handleSave}
            className={cn(
              'relative bottom-[20%] left-[88%] hover:bg-blue-600 cursor-pointer',
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

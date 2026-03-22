import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  id: string;
  label: string;
  accept: string;
  url: string;
  onUrlChange: (value: string) => void;
  pendingFile: File | null;
  onPendingFileChange: (file: File | null) => void;
  chooseFileLabel?: string;
  urlHint?: string;
};

/**
 * Choose a file (upload happens on form submit) or paste an external URL.
 */
export const AdminMediaUrlField: React.FC<Props> = ({
  id,
  label,
  accept,
  url,
  onUrlChange,
  pendingFile,
  onPendingFileChange,
  chooseFileLabel = 'Choose file',
  urlHint = 'Or paste a URL',
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    onPendingFileChange(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${id}-url`}>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          id={`${id}-file`}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onPendingFileChange(f);
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          {chooseFileLabel}
        </Button>
        {pendingFile && (
          <>
            <span className="text-xs text-muted-foreground truncate max-w-[220px]">
              {pendingFile.name}
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
              Clear file
            </Button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{urlHint}</p>
      <Input
        id={`${id}-url`}
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://..."
      />
      {url.trim() && !pendingFile && (
        <div className="mt-2 rounded border overflow-hidden bg-muted/30 inline-block max-w-full">
          {accept.includes('image') ? (
            <img src={url.trim()} alt="" className="max-h-24 w-auto object-contain" />
          ) : (
            <p className="text-xs p-2 text-muted-foreground">Current file URL set</p>
          )}
        </div>
      )}
    </div>
  );
};

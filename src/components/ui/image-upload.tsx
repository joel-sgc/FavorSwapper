import * as React from "react"

import { cn } from "@/lib/utils"
import { CloudUpload } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  file?: File | null
}

const ImageUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({ file, onChange, className, type, ...props }, ref) => {
    return (
      <label
        className={cn("flex flex-col gap-2 items-center justify-center p-4 border-4 border-dashed rounded-3xl w-full", className)}
      >
        {(file && file.size > 0) ? (
          <>
            <CloudUpload size={64}/>
            <div className="font-semibold text-foreground/90">{file.name} - ${Math.round((file.size / 1000 / 1000) * 100) / 100} MB</div>
            <div className="text-sm text-muted-foreground">You can upload one file (up to 32 MB each)</div>
          </>
        ) : (
          <>
            <CloudUpload size={64}/>
            <div className="font-semibold text-foreground/90 text-center">Drag 'n' drop some files here, or click to select files</div>
            <div className="text-sm text-muted-foreground text-center">You can upload one file (up to 4 MB each)</div>
          </>
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={ref}
          onChange={onChange}
          {...props}
        />
      </label>
    )
  }
)
ImageUpload.displayName = "ImageUpload"

export { ImageUpload }

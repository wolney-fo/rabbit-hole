import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FileUpIcon, UploadIcon, XIcon } from 'lucide-react'

import { uploadUrlResponseSchema } from '@/http/schemas/files'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/components/ui/attachment'
import { toast } from '@/components/ui/toast'

const uploadFormSchema = z.object({
  file: z.custom<FileList>(
    (value) => value instanceof FileList && value.length > 0,
    { error: 'Select a file to upload' },
  ),
})

type UploadFormSchema = z.infer<typeof uploadFormSchema>

async function uploadFile(file: File) {
  const contentType = file.type || 'application/octet-stream'

  const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to request an upload URL')
  }

  const { data } = uploadUrlResponseSchema.parse(await response.json())

  const uploadResponse = await fetch(data.url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': contentType },
  })

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload the file')
  }
}

export function UploadFileDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
  })

  const file = watch('file')?.[0]

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
      toast.add({
        title: 'File uploaded',
        type: 'success',
        priority: 'high',
      })
      setOpen(false)
    },
    onError: () => {
      toast.add({
        title: 'Failed to upload the file',
        type: 'error',
        priority: 'high',
      })
    },
  })

  async function onSubmit({ file }: UploadFormSchema) {
    await uploadMutation.mutateAsync(file[0])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open)

        if (!open) {
          reset()
        }
      }}
    >
      <DialogTrigger render={<Button />}>
        <FileUpIcon data-icon="inline-start" />
        New upload
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New upload</DialogTitle>
          <DialogDescription>
            Select a file from your device to share it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Attachment state={file ? 'done' : 'idle'} className="w-full">
                <AttachmentTrigger render={<label htmlFor="file" />} />
                <input
                  key={file ? 'has-file' : 'empty'}
                  id="file"
                  type="file"
                  className="sr-only"
                  {...register('file')}
                />
                <AttachmentMedia>
                  {file ? <FileUpIcon /> : <UploadIcon />}
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>
                    {file ? file.name : 'Click to select a file'}
                  </AttachmentTitle>
                  {file && (
                    <AttachmentDescription>{file.type}</AttachmentDescription>
                  )}
                </AttachmentContent>
                {file && (
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label="Remove file"
                      title="Remove file"
                      onClick={() => resetField('file')}
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                )}
              </Attachment>
              <FieldError>{errors.file?.message}</FieldError>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { ScrollArea } from '@/components/ui/scroll-area'

export default function FolderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <ScrollArea className="flex-1">
        {children}
      </ScrollArea>
    </div>
  )
}

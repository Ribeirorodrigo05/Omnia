import { notFound } from 'next/navigation'

import { categoryService } from '@/server/services/category-service'
import { spaceService } from '@/server/services/space-service'
import { FolderCategoriesClient } from '@/components/folder-categories-client'

type FolderPageProps = {
  params: Promise<{ id: string }>
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { id } = await params

  const folder = await categoryService.getById(id)

  if (!folder || folder.type !== 'folder') {
    notFound()
  }

  const [categories, space] = await Promise.all([
    categoryService.getByFolderId(folder.id),
    spaceService.getById(folder.spaceId),
  ])

  return (
    <FolderCategoriesClient
      folder={folder}
      categories={categories}
      spaceName={space?.name ?? ''}
    />
  )
}

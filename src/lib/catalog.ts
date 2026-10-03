import { PAGE_SIZE } from './config'
import type { Category } from './types'

interface Searchable {
  name: string
  description: string
  categoryName: string
}

export function matchesQuery(item: Searchable, query: string): boolean {
  const needle = query.toLowerCase()
  return [item.name, item.description, item.categoryName].some((field) => field.toLowerCase().includes(needle))
}

export function inCategory(item: Searchable, category: string): boolean {
  return item.categoryName.toLowerCase() === category.toLowerCase()
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(items.length / size))
  const current = Math.min(Math.max(1, page), pages)
  return { items: items.slice((current - 1) * size, current * size), page: current, pages, total: items.length }
}

/** Category names from the categories endpoint, topped up with any used by the items. */
export function categoryNames(categories: Category[], items: Searchable[]): string[] {
  const names = new Map<string, string>()
  for (const name of [...categories.map((c) => c.name), ...items.map((i) => i.categoryName)]) {
    if (name) names.set(name.toLowerCase(), names.get(name.toLowerCase()) ?? name)
  }
  return [...names.values()].sort((a, b) => a.localeCompare(b))
}

export function mergeByUuid<T extends { uuid: string }>(...lists: T[][]): T[] {
  return [...new Map(lists.flat().map((item) => [item.uuid, item])).values()]
}

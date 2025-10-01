import { createClient, Entry, EntrySkeletonType } from 'contentful';

// Define your fields as an interface that extends EntrySkeletonType
export interface MenuItemFields extends EntrySkeletonType {
  title: string;
  slug: string;
  content?: string;
}

// Use the fields interface for your Entry type
export type MenuItem = Entry<MenuItemFields>;

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Updated getMenuItems function with proper typing
export async function getMenuItems(): Promise<MenuItem[]> {
  const res = await client.getEntries<MenuItemFields>({
    content_type: 'menuItem',
  });
  return res.items;
}
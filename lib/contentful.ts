import { createClient, Entry, EntrySkeletonType } from 'contentful';

export interface MenuItemFields extends EntrySkeletonType {
  trainings: string;
  about: string;
  blog: string;
}

export type MenuItem = Entry<MenuItemFields>;

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function getMenuItems(): Promise<MenuItem[]> {
  const res = await client.getEntries<MenuItemFields>({
    content_type: 'menuItem',
  });

  return res.items;
}
import { getMenuItems, MenuItem } from '../lib/contentful';

export default async function Home() {
  const menuItems: MenuItem[] = await getMenuItems();

  const fieldKeys = menuItems.length > 0 ? Object.keys(menuItems[0].fields) : [];

  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 text-gray-800">
      <h1 className="text-4xl font-semibold">Menu from Contentful</h1>

      <ul className="flex flex-wrap justify-center gap-8 text-xl m-8">
        {fieldKeys.map((key) => (
          <li
            key={key}
            className="px-6 py-3 rounded-xl shadow-md hover:shadow-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {key}
          </li>
        ))}
      </ul>
    </div>

  );
}

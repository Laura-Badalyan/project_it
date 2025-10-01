import { GetStaticProps } from 'next';
import { getMenuItems, MenuItem } from '../lib/contentful';

type Props = {
  menuItems: MenuItem[];
};

export default function Home({ menuItems }: Props) {
  return (
    <div>
      <h1>Menu from Contentful</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.sys.id}>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const menuItems = await getMenuItems();
  return {
    props: {
      menuItems: menuItems || [],
    },
  };
};
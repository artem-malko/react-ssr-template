import { memo } from 'react';
import { CommonPage, Page } from 'core/store/types';
import { Link } from 'ui/kit/link';

export interface RootPage extends CommonPage {
  name: 'root';
}

export default memo<{ page: RootPage }>(() => {
  const links: Array<{ page: Page; title: string }> = [
    {
      page: { name: 'root' },
      title: '/',
    },
    {
      page: {
        name: 'news',
        params: {
          page: 1,
        },
      },
      title: 'news?p=1',
    },
    {
      page: {
        name: 'users',
        params: {
          page: 1,
        },
      },
      title: 'users?p=1',
    },
    {
      page: {
        name: 'newsItem',
        params: {
          id: 29133561,
        },
      },
      title: 'news/29133561',
    },
  ];

  return (
    <>
      <h1>
        Simple template for a website with SSR and{' '}
        <Link href="https://github.com/reactwg/react-18/discussions" target="_blank">
          React 18 with a brand new API
        </Link>
      </h1>
      <br />
      <br />
      <h2>Pages</h2>
      <div style={{ padding: 10, display: 'flex' }}>
        <ul>
          {links.map((link) => (
            <li key={link.title} style={{ paddingBottom: 8 }}>
              {link.page.name} — URL is <Link page={link.page}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
});

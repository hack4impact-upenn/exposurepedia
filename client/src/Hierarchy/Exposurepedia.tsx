/* eslint-disable react/react-in-jsx-scope */

import { ExposureItemTable } from '../components/ExposureItemTable';

/**
 * A page only accessible to authenticated users that displays hierarchies
 * in a table and allows users to expand and delete hierarchies.
 */

interface Item {
  title: string;
  disorder: string[];
  format: string[];
  interventionType: string[];
  maturity: string[];
  keywords: string[];
  modifications: string;
  link: string;
}

function Exposurepedia() {
  const rows = [
    {
      key: '1',
      title: 'Write your own obituary',
      format: 'Idea',
      likes: 45,
      date: '2021-10-10',
    },
    {
      key: '2',
      title: 'Young boy gets blood drawn',
      format: 'Reading',
      likes: 2,
      date: '2022-10-2',
    },
    {
      key: '3',
      title: 'Young girl gets a painfree shot',
      format: 'Video',
      likes: 100,
      date: '2021-11-04',
    },
  ];

  const columns = [
    { id: 'checkbox', label: '', minWidth: 15 },
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'format', label: 'Format', minWidth: 100 },
    { id: 'likes', label: 'Likes', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 100 },
  ];
  return (
    <div>
      <ExposureItemTable
        rows={rows}
        columns={columns}
        isApprove={false}
        isBroken={false}
      />
    </div>
  );
}

export default Exposurepedia;

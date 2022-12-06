/* eslint-disable react/react-in-jsx-scope */
import { Button, Box } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';

const styles = {
  button: {
    padding: '8px 15px',
  },
};

const handleCsvClick = async (
  title: string,
  items: string[],
  date: string,
  description: string,
  suds: number,
  order: number,
) => {
  let i = 1;
  console.log('handling');
  const resp: any[] = [];

  // eslint-disable-next-line array-callback-return
  items.map((item) => {
    resp.push({
      order: i,
      name: item,
      date,
      description,
      suds,
    });
    i += 1;
  });

  // console.log(resp);
  const options = {
    fieldSeparator: ',',
    filename: `${title} Full List Items`,
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Roster',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
    headers: ['No.', 'Item Name', 'Date', 'Description', 'SUDS'],
  };

  const csvExporter = new ExportToCsv(options);

  if (resp.length === 0) {
    window.alert("No one has RSVP'd yet.");
  } else {
    csvExporter.generateCsv(resp);
  }
};

interface HierarchyProps {
  h: Hierarchy;
}

interface Hierarchy {
  title: string;
  items: string[];
  date: string;
  description: string;
  suds: number;
  order: number;
}

function HierarchyPage({ h }: HierarchyProps) {
  return (
    <Box pt={3} textAlign="center">
      <Button
        title="Export as CSV"
        variant="contained"
        style={styles.button}
        onClick={() => {
          handleCsvClick(
            h.title,
            h.items,
            h.date,
            h.description,
            h.suds,
            h.order,
          );
        }}
      >
        Export as CSV
      </Button>
    </Box>
  );
}

export default HierarchyPage;

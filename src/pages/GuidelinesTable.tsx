import { Table, Button, Space } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const TableContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled(Button)`
  &.view-btn {
    color: #6523D1;
    &:hover {
      color: #8F5AE8;
    }
  }
`;

interface GuidelinesTableProps {
  guidelines: any[];
  onView: (guideline: any) => void;
  onDelete: (id: string) => void;
}

function GuidelinesTable({ guidelines, onView, onDelete }: GuidelinesTableProps) {
  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <ActionButton 
            type="text" 
            className="view-btn"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            View
          </ActionButton>
          <ActionButton 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record._id)}
          >
            Delete
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <TableContainer>
      <Table 
        columns={columns} 
        dataSource={guidelines}
        rowKey="_id"
      />
    </TableContainer>
  );
}

export default GuidelinesTable; 
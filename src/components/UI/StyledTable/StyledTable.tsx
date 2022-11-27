import Table from 'antd/lib/table';
import propTypes from 'prop-types';

export interface StyledTableProps {
  loading?: boolean;
  rowSelection?: any;
  columns?: any;
  response?: any;
  onPageChange?: any;
  onSizeChange?: any;
}

export default function StyledTable(props: StyledTableProps) {
  const { ...result } = props;

  return (
    <>
      <Table
        loading={result.loading}
        rowSelection={result.rowSelection}
        columns={result.columns}
        dataSource={result.response.data}
        size="small"
        pagination={{
          current: result.response.page + 1,
          total: result.response.totalElements,
          pageSize: result.response.size,
          position: ['bottomRight'],
          defaultPageSize: result.response.size,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30'],
          onChange: result.onPageChange,
          onShowSizeChange: result.onSizeChange,
          showTitle: true,
          showTotal: (total) => `Tổng số ${total} bản ghi`,
        }}
        scroll={{ x: 1500, y: 310 }}
        rowKey="id"
        locale={{ emptyText: 'Không tìm thấy dữ liệu.' }}
        title={() => `Tổng số bản ghi: ${result.response.totalElements}`}
        bordered
      />
    </>
  );
}

StyledTable.defaultProps = {
  loading: propTypes.bool,
  rowSelection: propTypes.shape,
  columns: propTypes.shape,
  response: propTypes.shape,
  onPageChange: propTypes.shape,
  onSizeChange: propTypes.shape,
};

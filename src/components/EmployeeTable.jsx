import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({ data, selectedRows, setSelectedRows, onEdit, onDeleteSingle, onMailSingle }) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map(emp => emp.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(i => i !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === data.length && data.length > 0}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp, index) => (
            <tr key={emp.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(emp.id)}
                  onChange={() => handleCheckboxChange(emp.id)}
                />
              </td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.address}</td>
              <td>{emp.phone}</td>
              <td>
                <span onClick={() => onEdit(index)} style={{ cursor: 'pointer' }}>✏️</span>&nbsp;
                <span onClick={() => onDeleteSingle(index)} style={{ cursor: 'pointer' }}>🗑️</span>&nbsp;
                <span onClick={() => onMailSingle(index)} style={{ cursor: 'pointer' }}>📧</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;

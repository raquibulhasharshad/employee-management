import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import EmployeeTable from './components/EmployeeTable';
import Footer from './components/Footer';
import AddEmployeeForm from './components/AddEmployeeForm';
import ConfirmDialog from './components/ConfirmDialog';
import employeeData from './components/data';
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem('employees');
    return stored ? JSON.parse(stored) : employeeData;
  });

  const [selectedRows, setSelectedRows] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmMode, setConfirmMode] = useState('confirm');
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentEmployees = employees.slice(startIndex, startIndex + recordsPerPage);
  const totalPages = Math.ceil(employees.length / recordsPerPage);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const handleDeleteSelected = () => {
    const pageSelected = selectedRows[currentPage] || [];
    if (pageSelected.length === 0) return;

    if (pageSelected.length === 1) {
      const emp = employees.find(e => e.id === pageSelected[0]);
      setConfirmMessage(`Are you sure you want to delete ${emp?.name || "this employee"}?`);
    } else {
      setConfirmMessage('Are you sure you want to delete selected employees?');
    }

    setConfirmMode('confirm');
    setConfirmAction(() => () => {
      const updated = employees.filter(emp => !pageSelected.includes(emp.id));
      setEmployees(updated);
      setSelectedRows(prev => ({ ...prev, [currentPage]: [] }));
      setShowConfirm(false);
      adjustPageAfterDelete(updated);
    });
    setShowConfirm(true);
  };

  const handleDeleteSingle = (index) => {
    const employee = employees[startIndex + index];

    setConfirmMessage(`Are you sure you want to delete ${employee?.name || "this employee"}?`);
    setConfirmMode('confirm');
    setConfirmAction(() => () => {
      const updated = [...employees];
      updated.splice(startIndex + index, 1);
      setEmployees(updated);
      setShowConfirm(false);
      adjustPageAfterDelete(updated);
    });
    setShowConfirm(true);
  };

  const adjustPageAfterDelete = (updatedList) => {
    const updatedTotalPages = Math.ceil(updatedList.length / recordsPerPage) || 1;
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }
  };

  const handleAddNew = () => {
    setEditEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    setEditEmployee(employees[startIndex + index]);
    setShowForm(true);
  };

  const handleSave = (employee) => {
    if (employee.id) {
      // EDIT existing
      const updated = employees.map(emp =>
        emp.id === employee.id ? employee : emp
      );
      setEmployees(updated);
    } else {
      // ADD new
      const newEmployee = { ...employee, id: Date.now() };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      const updatedTotalPages = Math.ceil(updated.length / recordsPerPage);
      setCurrentPage(updatedTotalPages);
    }
    setShowForm(false);
  };

  const showAlert = (message) => {
    setConfirmMessage(message);
    setConfirmMode('alert');
    setConfirmAction(() => () => setShowConfirm(false));
    setShowConfirm(true);
  };

  return (
    <div className="app-container">
      <Navbar
        isDeleteDisabled={!selectedRows[currentPage] || selectedRows[currentPage].length === 0}
        onDelete={handleDeleteSelected}
        onAdd={handleAddNew}
      />

      <EmployeeTable
        data={currentEmployees}
        selectedRows={selectedRows[currentPage] || []}
        setSelectedRows={(rows) =>
          setSelectedRows((prev) => ({ ...prev, [currentPage]: rows }))
        }
        onEdit={handleEdit}
        onDeleteSingle={handleDeleteSingle}
      />

      <Footer
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalL={employees.length}
        currentL={currentEmployees.length}
      />

      {showForm && (
        <div className="modal-overlay">
          <AddEmployeeForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            editData={editEmployee}
            onValidationError={showAlert}
          />
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
          mode={confirmMode}
        />
      )}
    </div>
  );
};

export default App;

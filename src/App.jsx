import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import EmployeeTable from './components/EmployeeTable';
import Footer from './components/Footer';
import AddEmployeeForm from './components/AddEmployeeForm';
import ConfirmDialog from './components/ConfirmDialog';
// import employeeData from './components/data';
import Mail from './components/Mail';
import Searchbar from './components/Searchbar';
import './App.css';

const App = () => {
  // const [employees, setEmployees] = useState(() => {
  //   const stored = localStorage.getItem('employees');
  //   let initial = stored ? JSON.parse(stored) : employeeData;

  //   // Ensure default image and unique id
  //   initial = initial.map((emp, idx) => ({
  //     ...emp,
  //     id: emp.id ?? idx + 1,
  //     image: emp.image ?? "https://i.pravatar.cc/150?img=3"
  //   }));

  //   return initial;
  // });

  const[employees, setEmployees]=useState([])
  const[isLoading, setisLoading]=useState(true)

  useEffect(()=>{
    fetch('https://685ba68989952852c2da5e98.mockapi.io/api/v1/employees')
      .then((res)=> res.json())
      .then((data)=>{
        setEmployees(data)
        setisLoading(false)
      })
      .catch((err)=>{
        console.error("Failed to fetch employee data: ", err)
        setisLoading(false)
      })
  },[])

  const [selectedRows, setSelectedRows] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmMode, setConfirmMode] = useState('confirm');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailRecipients, setMailRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(emp => {
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.phone.toLowerCase().includes(query)
    );
  });

  const recordsPerPage = 5;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + recordsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  // useEffect(() => {
  //   localStorage.setItem('employees', JSON.stringify(employees));
  // }, [employees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      const updated = employees.map(emp =>
        emp.id === employee.id ? { ...employee, image: employee.image ?? "https://i.pravatar.cc/150?img=3" } : emp
      );
      setEmployees(updated);
    } else {
      const newEmployee = {
        ...employee,
        id: Date.now(),
        image: employee.image ?? "https://i.pravatar.cc/150?img=3"
      };
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

  const handleBulkMail = () => {
    const emails = (selectedRows[currentPage] || [])
      .map(id => employees.find(emp => emp.id === id)?.email)
      .filter(Boolean);

    if (emails.length > 0) {
      setMailRecipients(emails);
      setShowMailModal(true);
    }
  };

  const handleSingleMail = (index) => {
    const emp = employees[startIndex + index];
    if (emp?.email) {
      setMailRecipients([emp.email]);
      setShowMailModal(true);
    }
  };

  const handleMailSend = (data) => {
    if (data.type === 'error') {
      setConfirmMessage(data.message);
      setConfirmMode('alert');
      setConfirmAction(() => () => setShowConfirm(false));
      setShowConfirm(true);
      return;
    }

    console.log("Send to: ", data.toEmails);
    console.log("subject: ", data.subject);
    console.log("body: ", data.body);

    setConfirmMessage(data.message);
    setConfirmMode('alert');
    setConfirmAction(() => () => setShowConfirm(false));
    setShowConfirm(true);
    setShowMailModal(false);
  };

  return (
    <div className="app-container">
      {isLoading ?( 
        <div style={{ textAlign: 'center', padding:'20px'}}>Loading...</div>
      ) : (
        <>
      <Navbar
        isDeleteDisabled={!selectedRows[currentPage] || selectedRows[currentPage].length === 0}
        isMailDisabled={!selectedRows[currentPage] || selectedRows[currentPage].length === 0}
        onDelete={handleDeleteSelected}
        onAdd={handleAddNew}
        onMail={handleBulkMail}
      />

      <Searchbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      {currentEmployees.length > 0 ? (
        <EmployeeTable
          data={currentEmployees}
          selectedRows={selectedRows[currentPage] || []}
          setSelectedRows={(rows) =>
            setSelectedRows((prev) => ({ ...prev, [currentPage]: rows }))
          }
          onEdit={handleEdit}
          onDeleteSingle={handleDeleteSingle}
          onMailSingle={handleSingleMail}
        />
      ) : (
        <div className="no-records">No records found.</div>
      )}

      {filteredEmployees.length > 0 && (
        <Footer
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalL={employees.length}
          currentL={currentEmployees.length}
        />
      )}

      <Mail
        isOpen={showMailModal}
        onClose={() => setShowMailModal(false)}
        toEmails={mailRecipients}
        OnSend={handleMailSend}
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
      
      </>
      )}
    </div>
  );
};

export default App;

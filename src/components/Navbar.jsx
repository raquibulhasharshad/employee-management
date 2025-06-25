import React from 'react';
import './Navbar.css';

const Navbar = ({ isDeleteDisabled, isMailDisabled, onDelete, onAdd, onMail }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">Manage Employees</div>
      <div className="navbar-right">
        <button
          className={`Mail ${isMailDisabled ? 'inactive' : ''}`}
          onClick={onMail}
          disabled={isMailDisabled}
        >
          📧 Mail
        </button>
        <button
          className={`Del ${isDeleteDisabled ? 'inactive' : ''}`}
          onClick={onDelete}
          disabled={isDeleteDisabled}
        >
          🗑️ Delete
        </button>
        <button className="Add" onClick={onAdd}>
          ➕ Add New Employee
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


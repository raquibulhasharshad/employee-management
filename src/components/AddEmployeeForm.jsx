import React, { useState, useEffect } from 'react';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ onSave, onCancel, editData, onValidationError }) => {
  const [form, setForm] = useState({
    id: null,
    name: '',
    email: '',
    address: '',
    phone: '',
    image: ''
  });

  useEffect(() => {
    if (editData) {
      setForm({
        id: editData.id || null, 
        image: editData.image,
        name: editData.name,
        email: editData.email,
        address: editData.address,
        phone: editData.phone
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { image, name, email, address, phone } = form;

    if (!image||!name || !email || !address || !phone) {
      onValidationError('Please fill in all fields');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      onValidationError('Please enter a valid email address');
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      onValidationError('Please enter a valid 10-digit phone number');
      return;
    }

    onSave(form); 
  };

  return (
    <div className="add-form-container">
      <form onSubmit={handleSubmit} className="add-form">

        <input
          type="text"
          name="image"
          placeholder="Image"
          value={form.image}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        {form.image && (
          <img 
          src={form.image}
          alt="Avatar Preview"
          />
        )} 

        <div className="button-row">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeeForm;

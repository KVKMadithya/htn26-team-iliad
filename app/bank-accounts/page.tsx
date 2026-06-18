"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/sidebar";
import { Search, Bell } from "@/components/Icons";

type Screen = "list" | "add" | "edit";

export default function AccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Screen state
  const [screen, setScreen] = useState<Screen>("list");
  
  // Check if we're in edit mode from URL
  const isEditMode = searchParams.get("mode") === "edit";
  const accountNumberParam = searchParams.get("accountNumber") || "";
  const nicknameParam = searchParams.get("nickname") || "";
  const accountNameParam = searchParams.get("accountName") || "";
  const emailParam = searchParams.get("email") || "";

  // Form data state
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    email: "",
    nickname: "",
  });

  // Edit nickname state
  const [nickname, setNickname] = useState("");

  // Validation errors state
  const [errors, setErrors] = useState({
    accountNumber: "",
    accountName: "",
    email: "",
    nickname: "",
  });

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        accountNumber: accountNumberParam,
        accountName: accountNameParam,
        email: emailParam,
        nickname: nicknameParam,
      });
      setNickname(nicknameParam || accountNameParam);
      setScreen("edit");
    }
  }, [isEditMode, accountNumberParam, accountNameParam, emailParam, nicknameParam]);

  // ===== VALIDATION FUNCTIONS =====
  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case "accountNumber":
        if (!value.trim()) {
          error = "Account number is required";
        } else if (!/^\d+$/.test(value)) {
          error = "Account number must contain only numbers";
        } else if (value.length < 8 || value.length > 20) {
          error = "Account number must be between 8 and 20 digits";
        }
        break;
        
      case "accountName":
        if (!value.trim()) {
          error = "Account name is required";
        } else if (value.trim().length < 2) {
          error = "Account name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Account name must contain only letters and spaces";
        }
        break;
        
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
        
      case "nickname":
        if (!value.trim()) {
          error = "Nickname is required";
        } else if (value.trim().length < 2) {
          error = "Nickname must be at least 2 characters";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      accountNumber: validateField("accountNumber", formData.accountNumber),
      accountName: validateField("accountName", formData.accountName),
      email: validateField("email", formData.email),
      nickname: validateField("nickname", formData.nickname),
    };
    
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  // ===== RESET FORM FUNCTION =====
  const resetForm = () => {
    setFormData({
      accountNumber: "",
      accountName: "",
      email: "",
      nickname: "",
    });
    setNickname("");
    setErrors({
      accountNumber: "",
      accountName: "",
      email: "",
      nickname: "",
    });
  };

  // ===== NAVIGATION FUNCTIONS =====
  const goToList = () => {
    resetForm();
    setScreen("list");
    router.push("/accounts");
  };

  const goToAdd = () => {
    resetForm();
    setScreen("add");
    router.push("/accounts?mode=add");
  };

  const goToEdit = () => {
    setScreen("edit");
    router.push("/accounts?mode=edit");
  };

  // ===== FORM HANDLERS =====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector(".field-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    
    console.log("Adding new account:", formData);
    alert("Account added successfully!");
    resetForm();
    goToList();
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least account number is filled
    if (!formData.accountNumber.trim()) {
      alert("Please enter an account number first");
      return;
    }
    
    // Navigate to edit mode with whatever data is filled
    router.push(
      `/accounts?mode=edit&accountNumber=${formData.accountNumber}&accountName=${formData.accountName || ""}&email=${formData.email || ""}&nickname=${formData.nickname || ""}`
    );
  };

  const handleEditNickname = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      alert("Please enter a nickname");
      return;
    }
    
    if (nickname.trim().length < 2) {
      alert("Nickname must be at least 2 characters");
      return;
    }
    
    console.log("Updating nickname to:", nickname);
    alert(`Nickname updated to: ${nickname}`);
    resetForm();
    goToList();
  };

  const handleCancel = () => {
    resetForm();
    goToList();
  };

  return (
    <main className="accounts-page">
      <Sidebar />
      <section className="content">
        {/* ===== LIST SCREEN ===== */}
        {screen === "list" && (
          <>
            <header className="content-header">
              <h1 className="page-title">Accounts</h1>
              <div className="header-actions">
                <Search size={22} />
                <Bell size={22} />
                <div className="avatar-placeholder">
                  <Image
                    src="/person-logo.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </div>
              </div>
            </header>

            <div className="cards-container">
              <div className="account-card">
                <div className="icon-edit" onClick={goToEdit}>✏️</div>
                <div className="icon-delete">🗑️</div>
                <div className="account-card-content">
                  <h2 className="account-name">Anura</h2>
                  <div className="account-avatar">
                    <Image
                      src="/account-logo.png"
                      alt="profile"
                      width={100}
                      height={100}
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                  </div>
                  <p className="account-details">
                    Nova Bank <br />
                    Colombo 05
                  </p>
                </div>
              </div>

              <button className="add-account-card" onClick={goToAdd}>
                <h2 className="add-account-title">Add a Bank Account</h2>
                <div className="add-account-icon">+</div>
              </button>
            </div>
          </>
        )}

        {/* ===== ADD SCREEN ===== */}
        {screen === "add" && (
          <>
            <header className="content-header">
              <h1 className="page-title">Accounts</h1>
              <div className="header-actions">
                <Search size={22} />
                <Bell size={22} />
                <div className="avatar-placeholder">
                  <Image
                    src="/person-logo.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </div>
              </div>
            </header>

            <div className="form-container">
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Add Another Bank Account</h2>
                </div>

                <form className="form-fields">
                  <div className="form-group">
                    <label htmlFor="accountNumber">Bank Account Number:</label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter account number"
                      className={errors.accountNumber ? "input-error" : ""}
                      required
                    />
                    {errors.accountNumber && (
                      <span className="field-error">{errors.accountNumber}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accountName">Bank Account Name:</label>
                    <input
                      type="text"
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter account holder name"
                      className={errors.accountName ? "input-error" : ""}
                      required
                    />
                    {errors.accountName && (
                      <span className="field-error">{errors.accountName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter email address"
                      className={errors.email ? "input-error" : ""}
                      required
                    />
                    {errors.email && (
                      <span className="field-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter a nickname"
                      className={errors.nickname ? "input-error" : ""}
                      required
                    />
                    {errors.nickname && (
                      <span className="field-error">{errors.nickname}</span>
                    )}
                  </div>

                  <div className="form-actions-bottom">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="button" className="btn-add" onClick={handleAddAccount}>
                      Add Account
                    </button>
                    <button type="button" className="btn-update" onClick={handleUpdateAccount}>
                      Update Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* ===== EDIT SCREEN ===== */}
        {screen === "edit" && (
          <>
            <header className="content-header">
              <h1 className="page-title">Accounts</h1>
              <div className="header-actions">
                <Search size={22} />
                <Bell size={22} />
                <div className="avatar-placeholder">
                  <Image
                    src="/person-logo.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                </div>
              </div>
            </header>

            <div className="form-container">
              <div className="form-card">
                <div className="form-header">
                  <h2 className="form-title">Edit the nickname</h2>
                </div>

                <form onSubmit={handleEditNickname} className="form-fields">
                  <div className="form-group">
                    <label htmlFor="accountNumber">Bank Account Number:</label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={formData.accountNumber || "1234567890"}
                      disabled
                      className="input-disabled"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nickname">Nickname:</label>
                    <input
                      type="text"
                      id="nickname"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="Enter new nickname"
                      required
                    />
                  </div>

                  <div className="form-actions-bottom">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-update">
                      UPDATE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ===== STYLES ===== */}
      <style jsx>{`
        /* ===== GLOBAL STYLES ===== */
        .accounts-page {
          width: 100vw;
          min-height: 100vh;
          background: #f1f1f1;
          display: flex;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* ===== CONTENT ===== */
        .content {
          flex: 1;
          padding: 1.5rem 1.25rem;
          overflow-y: auto;
          min-width: 0;
        }

        /* ===== HEADER ===== */
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: black;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: #93c5fd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== CARDS CONTAINER ===== */
        .cards-container {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        /* ===== ACCOUNT CARD ===== */
        .account-card {
          width: 520px;
          max-width: 100%;
          height: 190px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 2px solid #3b82f6;
          position: relative;
        }

        .icon-edit {
          position: absolute;
          left: 1rem;
          top: 1rem;
          color: black;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          padding: 4px;
          border-radius: 50%;
        }

        .icon-edit:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }

        .icon-delete {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          color: black;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s;
          padding: 4px;
          border-radius: 50%;
        }

        .icon-delete:hover {
          background: #fee2e2;
          transform: scale(1.1);
        }

        .account-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        }

        .account-name {
          font-weight: 700;
          font-size: 18px;
          margin: 0;
          color: black;
        }

        .account-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-top: 0.5rem;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .account-details {
          font-size: 12px;
          margin-top: 0.5rem;
          color: #000000;
          text-align: center;
          line-height: 1.4;
        }

        /* ===== ADD ACCOUNT CARD ===== */
        .add-account-card {
          width: 520px;
          max-width: 100%;
          height: 170px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .add-account-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .add-account-card:active {
          transform: scale(0.98);
        }

        .add-account-title {
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 1.5rem;
          color: black;
        }

        .add-account-icon {
          font-size: 40px;
          font-weight: 300;
          color: black;
        }

        /* ===== FORM CONTAINER ===== */
        .form-container {
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .form-card {
          width: 650px;
          max-width: 100%;
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .form-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-title {
          font-size: 22px;
          font-weight: 600;
          color: black;
          margin: 0;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ===== FORM GROUP ===== */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }

        .form-group label {
          font-weight: 500;
          font-size: 14px;
          color: #374151;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s;
          outline: none;
          font-family: inherit;
          width: 100%;
        }

        .form-group input:focus {
          border-color: #450043;
          box-shadow: 0 0 0 3px rgba(69, 0, 67, 0.1);
        }

        .form-group input::placeholder {
          color: #9ca3af;
        }

        .input-disabled {
          background: #f3f4f6;
          color: #6b7280;
          cursor: not-allowed;
        }

        .input-disabled:focus {
          border-color: #e5e7eb;
          box-shadow: none;
        }

        /* ===== VALIDATION STYLES ===== */
        .input-error {
          border-color: #ef4444 !important;
        }

        .input-error:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }

        .field-error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 0.25rem;
          display: block;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== FORM ACTIONS ===== */
        .form-actions-bottom {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .btn-cancel,
        .btn-add,
        .btn-update {
          padding: 0.7rem 2rem;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 120px;
        }

        .btn-cancel {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-cancel:hover {
          background: #d1d5db;
          transform: scale(1.02);
        }

        .btn-add {
          background: #450043;
          color: white;
        }

        .btn-add:hover {
          background: #5a0058;
          transform: scale(1.02);
          box-shadow: 0 4px 6px -1px rgba(69, 0, 67, 0.3);
        }

        .btn-add:active {
          transform: scale(0.98);
        }

        .btn-update {
          background: #2563eb;
          color: white;
        }

        .btn-update:hover {
          background: #1d4ed8;
          transform: scale(1.02);
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        }

        .btn-update:active {
          transform: scale(0.98);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .accounts-page {
            flex-direction: column;
          }

          .content {
            padding: 1rem;
          }

          .page-title {
            font-size: 22px;
          }

          .account-card,
          .add-account-card {
            width: 100%;
            height: 160px;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 20px;
          }

          .form-actions-bottom {
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn-cancel,
          .btn-add,
          .btn-update {
            width: 100%;
            text-align: center;
            padding: 0.6rem;
            min-width: unset;
          }
        }

        @media (max-width: 480px) {
          .header-actions {
            gap: 0.75rem;
          }
          .avatar-placeholder {
            width: 35px;
            height: 35px;
          }
          .page-title {
            font-size: 20px;
          }
          .account-card,
          .add-account-card {
            height: 150px;
          }
          .account-name {
            font-size: 16px;
          }
          .account-avatar {
            width: 60px;
            height: 60px;
          }

          .form-card {
            padding: 1rem;
          }

          .form-title {
            font-size: 18px;
          }

          .form-group input {
            padding: 0.6rem 0.75rem;
            font-size: 13px;
          }

          .field-error {
            font-size: 10px;
          }
        }
      `}</style>
    </main>
  );
}

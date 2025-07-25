
# 🏍️ Multi-Role E-Commerce Management System

A robust and scalable multi-role e-commerce platform empowering Super Admins, Admins, Vendors, and Users with dynamic dashboards, seamless product and order management, advanced reporting, and role-based access control for a powerful end-to-end management experience

---

## ✨ Features Overview

### 👑 Super Admin / Admin Dashboard

* Monthly Revenue & Signups Charts
* Total Users, Vendors, Products, Orders, Revenue
* Active/Inactive Vendor Management
* **User Management**:
  
  **Super Admin Privileges**:
  * Add/Delete/Block/Unblock **Users, Vendors, Admins**
  * Assign Roles (User, Vendor, Admin)
  
  **Admin Privileges**:
  * Delete/Block/Unblock **Users only**
  
  **Common Functionalities (Super Admin & Admin)**:
  * Search, Sort, Pagination

* **Seller Management** (Super Admin & Admin):
  * Approve/Decline Seller Requests
  * Activate/Block/Reactivate Sellers
  * Search, Sort, Pagination

* **Category Management** (Super Admin & Admin):
  * Add, Update, Delete Categories
  * Search, Sort, Pagination

---

### 🏪 Vendor Dashboard

* Dashboard Overview:
  * Total Products, Featured Products, Views, Sales, Revenue
  * Pending Reports & Monthly Revenue Chart
* **Reports**:
  * Retrieve User Reports (with Pagination, Sort, Filter)
  * Change Report Status: Resolved/Pending/Rejected
* **Orders**:
  * Retrieve Vendor Orders (with Pagination, Sort)
  * Update Order Status: Confirmed/Processing/Delivered/Cancelled
* **Product Management**:
  * Retrieve/Create/Update/Delete Products (Up to 5 Images)
  * Archive/Unarchive, Feature/Unfeature Products
  * Search, Sort, Filter (All, Featured, Archived)

---

### 👤 User Dashboard

* Dashboard Overview:
  * Total Orders, Pending Orders, Total Purchases, Reports Submitted
  * Mini Graph (Orders/Purchases over 7/30 days)
* **Profile Management**:
  * Update Profile Image, Name, Phone Number
  * Change Password (System-registered users only)
* **Reports**:
  * Retrieve/Edit/Delete Submitted Reports (with Pagination)
* **Orders**:
  * View Orders with Sorting & Pagination
  * Detailed Order View
* **Purchases & Reviews**:
  * Retrieve Purchases (Sorting & Pagination)
  * Submit Reports & Add Reviews
  * Manage Submitted Reviews (View/Edit/Delete)

---

### 🛒 User Activities

* **Authenticated Users**:
  * Add to Cart, Wishlist, Purchase Products
  * Browse/Search/Filter Products
* **Public (Non-Authenticated) Users**:
  * Browse Products Freely
  * Filter by Price or Category
  * Search Results Page (Pagination, Sorting)
  * View Featured Products (Pagination, Sorting)

---

## ⚙️ Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Frontend**       | React, Redux Toolkit, Tailwind CSS, Typescript|
| **Backend**        | Node.js, Express.js ,Typescript               |
| **Database**       | MongoDB Atlas                                 |
| **Caching**        | Redis Cloud                                   |
| **File Storage**   | Cloudinary                                    |
| **Authentication** | JWT (Access & Refresh Tokens)                 |
| **Deployment**     | Firebase Hosting (Frontend), Render (Backend) |
| **RBAC (Role-Based Access Control)** | Custom Middleware-based Access Layer |

---

## 🚀 Caching Strategy (Redis)

Implemented **Redis Caching** across all critical modules:

* Product Listings & Details
* Orders & Reports Retrieval
* Category Data
* Vendor/Product Search Queries
* Reduces DB Hits, Optimizes API Performance.

---

 
## 🔗 Live Demo

Visit the live application:  
🌐 [https://orbitbazaar-39cf5.web.app/](https://orbitbazaar-39cf5.web.app/)

---

## 📊 API Documentation

* Swagger API Docs: [https://orbitbazaar-server.onrender.com/api-docs/](https://orbitbazaar-server.onrender.com/api-docs/)

---

## 📞 Contact

* **Name:** Saim Al Ifran
* **LinkedIn:** [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
* **Email:** [your.email@example.com](mailto:your.email@example.com)

---



```
🚀 Multi-role E-commerce System | Typescript | React | Redux Toolkit | Node.js | Express | MongoDB | Redis | Cloudinary | JWT | Firebase Hosting
```

import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import { TabView, TabPanel } from 'primereact/tabview'
import PaymentForm from './PaymentForm'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

const PaymentBilling = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      client: 'Emma Wilson',
      invoiceId: 'INV-2025-001',
      amount: 150.00,
      status: 'Paid',
      dueDate: '2025-01-15',
      paymentMethod: 'Credit Card',
      date: '2025-01-10',
      notes: 'Monthly membership fee'
    },
    {
      id: 2,
      client: 'John Smith',
      invoiceId: 'INV-2025-002',
      amount: 75.00,
      status: 'Pending',
      dueDate: '2025-01-20',
      paymentMethod: 'Bank Transfer',
      date: '2025-01-15',
      notes: 'Personal training sessions'
    },
    {
      id: 3,
      client: 'Lisa Brown',
      invoiceId: 'INV-2025-003',
      amount: 200.00,
      status: 'Overdue',
      dueDate: '2025-01-05',
      paymentMethod: 'Cash',
      date: '2025-01-01',
      notes: 'Premium package'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === 'Paid' ? 'success' : 
                    rowData.status === 'Pending' ? 'warning' : 'danger'
    return <Badge value={rowData.status} severity={severity} />
  }

  const amountBodyTemplate = (rowData) => {
    return `$${rowData.amount.toFixed(2)}`
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text"
          style={{ color: '#AD8654' }}
          onClick={() => handleView(rowData)}
          tooltip="View"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text"
          style={{ color: '#AD8654' }}
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-file-pdf"
          className="p-button-rounded p-button-text"
          style={{ color: '#21C8B1' }}
          onClick={() => generateInvoicePDF(rowData)}
          tooltip="Generate PDF"
        />
        {rowData.status === 'Paid' && (
          <Button
            icon="pi pi-undo"
            className="p-button-rounded p-button-text"
            style={{ color: '#FED555' }}
            onClick={() => handleRefund(rowData)}
            tooltip="Process Refund"
          />
        )}
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedPayment(null)
    setShowForm(true)
  }

  const handleEdit = (payment) => {
    setSelectedPayment(payment)
    setShowForm(true)
  }

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setShowForm(true)
  }

  const handleRefund = (payment) => {
    setPayments(payments.map(p => 
      p.id === payment.id ? { ...p, status: 'Refunded' } : p
    ))
    alert(`Refund processed for ${payment.client} - $${payment.amount}`)
  }

  const handleSave = (paymentData) => {
    if (selectedPayment) {
      setPayments(payments.map(p => 
        p.id === selectedPayment.id ? { ...paymentData, id: selectedPayment.id } : p
      ))
    } else {
      const newPayment = {
        ...paymentData,
        id: Math.max(...payments.map(p => p.id)) + 1,
        invoiceId: `INV-2025-${String(Math.max(...payments.map(p => p.id)) + 1).padStart(3, '0')}`
      }
      setPayments([...payments, newPayment])
    }
    setShowForm(false)
  }

  const generateInvoicePDF = (payment) => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('FITNESS ADMIN', 20, 30)
    doc.setFontSize(12)
    doc.text('Invoice', 20, 45)
    
    // Invoice details
    doc.text(`Invoice ID: ${payment.invoiceId}`, 20, 65)
    doc.text(`Client: ${payment.client}`, 20, 75)
    doc.text(`Date: ${payment.date}`, 20, 85)
    doc.text(`Due Date: ${payment.dueDate}`, 20, 95)
    doc.text(`Amount: $${payment.amount.toFixed(2)}`, 20, 105)
    doc.text(`Status: ${payment.status}`, 20, 115)
    doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 125)
    doc.text(`Notes: ${payment.notes}`, 20, 135)
    
    doc.save(`invoice-${payment.invoiceId}.pdf`)
  }

  const exportToCSV = () => {
    const csv = Papa.unparse(payments)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'payments-export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateFinancialReport = () => {
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)
    const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0)

    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('FINANCIAL REPORT', 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    
    doc.text(`Total Revenue (Paid): $${totalRevenue.toFixed(2)}`, 20, 65)
    doc.text(`Pending Payments: $${pendingAmount.toFixed(2)}`, 20, 75)
    doc.text(`Overdue Payments: $${overdueAmount.toFixed(2)}`, 20, 85)
    doc.text(`Total Outstanding: $${(pendingAmount + overdueAmount).toFixed(2)}`, 20, 95)
    
    doc.save('financial-report.pdf')
  }

  const header = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h3 className="text-lg font-semibold text-fitness-primary">Payment & Billing</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search payments..."
            className="w-full sm:w-auto"
          />
        </span>
        <Button
          label="Export CSV"
          icon="pi pi-download"
          onClick={exportToCSV}
          className="bg-fitness-accent-secondary hover:bg-fitness-accent"
        />
        <Button
          label="Financial Report"
          icon="pi pi-file-pdf"
          onClick={generateFinancialReport}
          className="bg-fitness-accent-secondary hover:bg-fitness-accent"
        />
        <Button
          label="Add Payment"
          icon="pi pi-plus"
          onClick={handleAdd}
          className="bg-fitness-accent hover:bg-fitness-accent-secondary"
        />
      </div>
    </div>
  )

  // Calculate summary data
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-fitness-primary">Payment & Billing</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-semibold text-fitness-accent">${totalRevenue.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Pending Payments</p>
            <p className="text-2xl font-semibold text-fitness-warning">${pendingAmount.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Overdue Payments</p>
            <p className="text-2xl font-semibold text-red-500">${overdueAmount.toFixed(2)}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Total Invoices</p>
            <p className="text-2xl font-semibold text-fitness-primary">{payments.length}</p>
          </div>
        </Card>
      </div>

      <TabView>
        <TabPanel header="All Payments">
          <Card className="bg-white shadow-md">
            <DataTable
              value={payments}
              header={header}
              globalFilter={globalFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
              emptyMessage="No payments found"
              responsiveLayout="scroll"
            >
              <Column field="client" header="Client" sortable />
              <Column field="invoiceId" header="Invoice ID" sortable />
              <Column field="amount" header="Amount" body={amountBodyTemplate} sortable />
              <Column field="status" header="Status" body={statusBodyTemplate} sortable />
              <Column field="dueDate" header="Due Date" sortable />
              <Column field="paymentMethod" header="Payment Method" sortable />
              <Column header="Actions" body={actionBodyTemplate} style={{ width: '200px' }} />
            </DataTable>
          </Card>
        </TabPanel>

        <TabPanel header="Overdue Payments">
          <Card className="bg-white shadow-md">
            <DataTable
              value={payments.filter(p => p.status === 'Overdue')}
              paginator
              rows={10}
              className="p-datatable-sm"
              emptyMessage="No overdue payments"
              responsiveLayout="scroll"
            >
              <Column field="client" header="Client" sortable />
              <Column field="invoiceId" header="Invoice ID" sortable />
              <Column field="amount" header="Amount" body={amountBodyTemplate} sortable />
              <Column field="dueDate" header="Due Date" sortable />
              <Column field="paymentMethod" header="Payment Method" sortable />
              <Column header="Actions" body={actionBodyTemplate} style={{ width: '200px' }} />
            </DataTable>
          </Card>
        </TabPanel>
      </TabView>

      {showForm && (
        <PaymentForm
          payment={selectedPayment}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default PaymentBilling
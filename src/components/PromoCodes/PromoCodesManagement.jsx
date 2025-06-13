import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import PromoCodeForm from './PromoCodeForm'

const PromoCodesManagement = () => {
  const [promoCodes, setPromoCodes] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      discount: 20,
      expiryDate: '2025-03-31',
      status: 'Active',
      description: 'Welcome discount for new members',
      usageCount: 15,
      maxUsage: 100
    },
    {
      id: 2,
      code: 'SUMMER15',
      discount: 15,
      expiryDate: '2025-08-31',
      status: 'Active',
      description: 'Summer promotion discount',
      usageCount: 8,
      maxUsage: 50
    },
    {
      id: 3,
      code: 'EXPIRED10',
      discount: 10,
      expiryDate: '2024-12-31',
      status: 'Expired',
      description: 'Holiday season discount',
      usageCount: 25,
      maxUsage: 25
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedPromoCode, setSelectedPromoCode] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === 'Active' ? 'success' : 'danger'
    return <Badge value={rowData.status} severity={severity} />
  }

  const discountBodyTemplate = (rowData) => {
    return `${rowData.discount}%`
  }

  const usageBodyTemplate = (rowData) => {
    return `${rowData.usageCount}/${rowData.maxUsage}`
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
          icon="pi pi-trash"
          className="p-button-rounded p-button-text"
          style={{ color: '#FED555' }}
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
        {rowData.status === 'Active' && (
          <Button
            icon="pi pi-ban"
            className="p-button-rounded p-button-text"
            style={{ color: '#FED555' }}
            onClick={() => handleDeactivate(rowData)}
            tooltip="Deactivate"
          />
        )}
      </div>
    )
  }

  const handleAdd = () => {
    setSelectedPromoCode(null)
    setShowForm(true)
  }

  const handleEdit = (promoCode) => {
    setSelectedPromoCode(promoCode)
    setShowForm(true)
  }

  const handleView = (promoCode) => {
    setSelectedPromoCode(promoCode)
    setShowForm(true)
  }

  const handleDelete = (promoCode) => {
    setPromoCodes(promoCodes.filter(p => p.id !== promoCode.id))
  }

  const handleDeactivate = (promoCode) => {
    setPromoCodes(promoCodes.map(p => 
      p.id === promoCode.id ? { ...p, status: 'Inactive' } : p
    ))
  }

  const handleSave = (promoCodeData) => {
    if (selectedPromoCode) {
      // Update existing promo code
      setPromoCodes(promoCodes.map(p => 
        p.id === selectedPromoCode.id ? { ...promoCodeData, id: selectedPromoCode.id } : p
      ))
    } else {
      // Add new promo code
      const newPromoCode = {
        ...promoCodeData,
        id: Math.max(...promoCodes.map(p => p.id)) + 1,
        usageCount: 0
      }
      setPromoCodes([...promoCodes, newPromoCode])
    }
    setShowForm(false)
  }

  const header = (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h2 className="text-2xl font-semibold text-fitness-primary">Promo Codes Management</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search promo codes..."
            className="w-full sm:w-auto"
          />
        </span>
        <Button
          label="Add Promo Code"
          icon="pi pi-plus"
          onClick={handleAdd}
          className="bg-fitness-accent hover:bg-fitness-accent-secondary"
        />
      </div>
    </div>
  )

  // Calculate summary data
  const activeCount = promoCodes.filter(p => p.status === 'Active').length
  const expiredCount = promoCodes.filter(p => p.status === 'Expired').length
  const totalUsage = promoCodes.reduce((sum, p) => sum + p.usageCount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-fitness-primary">Promo Codes Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Total Codes</p>
            <p className="text-2xl font-semibold text-fitness-primary">{promoCodes.length}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Active Codes</p>
            <p className="text-2xl font-semibold text-fitness-accent">{activeCount}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Expired Codes</p>
            <p className="text-2xl font-semibold text-red-500">{expiredCount}</p>
          </div>
        </Card>
        <Card className="bg-white shadow-md">
          <div className="text-center">
            <p className="text-fitness-secondary text-sm font-medium">Total Usage</p>
            <p className="text-2xl font-semibold text-fitness-accent-secondary">{totalUsage}</p>
          </div>
        </Card>
      </div>

      <Card className="bg-white shadow-md">
        <DataTable
          value={promoCodes}
          header={header}
          globalFilter={globalFilter}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className="p-datatable-sm"
          emptyMessage="No promo codes found"
          responsiveLayout="scroll"
        >
          <Column field="code" header="Code" sortable />
          <Column field="discount" header="Discount (%)" body={discountBodyTemplate} sortable />
          <Column field="expiryDate" header="Expiry Date" sortable />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column field="usage" header="Usage" body={usageBodyTemplate} />
          <Column field="description" header="Description" />
          <Column header="Actions" body={actionBodyTemplate} style={{ width: '200px' }} />
        </DataTable>
      </Card>

      {showForm && (
        <PromoCodeForm
          promoCode={selectedPromoCode}
          visible={showForm}
          onHide={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default PromoCodesManagement
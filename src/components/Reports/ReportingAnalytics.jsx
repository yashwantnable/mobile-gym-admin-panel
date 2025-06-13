import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { TabView, TabPanel } from 'primereact/tabview'
import jsPDF from 'jspdf'
import Papa from 'papaparse'

const ReportingAnalytics = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()])
  const [reportType, setReportType] = useState('bookings')

  const reportTypes = [
    { label: 'Bookings Report', value: 'bookings' },
    { label: 'Revenue Report', value: 'revenue' },
    { label: 'Attendance Report', value: 'attendance' },
    { label: 'Client Demographics', value: 'demographics' }
  ]

  // Mock data for reports
  const bookingsData = [
    { month: 'Jan', bookings: 120, revenue: 3600, attendance: 95 },
    { month: 'Feb', bookings: 135, revenue: 4050, attendance: 88 },
    { month: 'Mar', bookings: 150, revenue: 4500, attendance: 92 },
    { month: 'Apr', bookings: 142, revenue: 4260, attendance: 90 },
    { month: 'May', bookings: 168, revenue: 5040, attendance: 94 },
    { month: 'Jun', bookings: 180, revenue: 5400, attendance: 96 }
  ]

  const sessionPopularityData = {
    labels: ['Yoga', 'Cardio', 'Zumba', 'Strength', 'Pilates'],
    datasets: [
      {
        label: 'Sessions Booked',
        data: [85, 72, 58, 45, 38],
        backgroundColor: ['#21C8B1', '#AD8654', '#FED555', '#99928D', '#353535']
      }
    ]
  }

  const revenueChartData = {
    labels: bookingsData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: bookingsData.map(item => item.revenue),
        backgroundColor: '#21C8B1',
        borderColor: '#21C8B1',
        borderWidth: 2,
        fill: false
      }
    ]
  }

  const attendanceChartData = {
    labels: bookingsData.map(item => item.month),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: bookingsData.map(item => item.attendance),
        backgroundColor: '#AD8654',
        borderColor: '#AD8654',
        borderWidth: 2,
        fill: false
      }
    ]
  }

  const clientDemographicsData = {
    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
    datasets: [
      {
        data: [25, 35, 20, 15, 5],
        backgroundColor: ['#21C8B1', '#AD8654', '#FED555', '#99928D', '#353535']
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  // Detailed report data
  const detailedBookingsReport = [
    { date: '2025-01-15', client: 'Emma Wilson', session: 'Morning Yoga', trainer: 'Sarah Johnson', revenue: 30 },
    { date: '2025-01-15', client: 'John Smith', session: 'HIIT Cardio', trainer: 'Mike Davis', revenue: 25 },
    { date: '2025-01-16', client: 'Lisa Brown', session: 'Pilates', trainer: 'Anna Lee', revenue: 35 },
    { date: '2025-01-16', client: 'Emma Wilson', session: 'Strength Training', trainer: 'Tom Wilson', revenue: 40 }
  ]

  const trainerPerformanceData = [
    { trainer: 'Sarah Johnson', sessions: 45, revenue: 1350, rating: 4.8 },
    { trainer: 'Mike Davis', sessions: 38, revenue: 950, rating: 4.6 },
    { trainer: 'Anna Lee', sessions: 42, revenue: 1260, rating: 4.9 },
    { trainer: 'Tom Wilson', trainer: 35, revenue: 1400, rating: 4.7 }
  ]

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('FITNESS ADMIN ANALYTICS REPORT', 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    doc.text(`Report Type: ${reportTypes.find(r => r.value === reportType)?.label}`, 20, 55)
    
    // Add summary data
    let yPosition = 75
    doc.text('SUMMARY:', 20, yPosition)
    yPosition += 15
    
    if (reportType === 'bookings') {
      const totalBookings = bookingsData.reduce((sum, item) => sum + item.bookings, 0)
      doc.text(`Total Bookings: ${totalBookings}`, 20, yPosition)
      yPosition += 10
      doc.text(`Average Monthly Bookings: ${Math.round(totalBookings / bookingsData.length)}`, 20, yPosition)
    } else if (reportType === 'revenue') {
      const totalRevenue = bookingsData.reduce((sum, item) => sum + item.revenue, 0)
      doc.text(`Total Revenue: $${totalRevenue}`, 20, yPosition)
      yPosition += 10
      doc.text(`Average Monthly Revenue: $${Math.round(totalRevenue / bookingsData.length)}`, 20, yPosition)
    }
    
    doc.save(`${reportType}-report.pdf`)
  }

  const exportToCSV = () => {
    let dataToExport = []
    
    if (reportType === 'bookings') {
      dataToExport = detailedBookingsReport
    } else if (reportType === 'revenue') {
      dataToExport = bookingsData
    } else if (reportType === 'attendance') {
      dataToExport = bookingsData.map(item => ({
        month: item.month,
        attendance: item.attendance,
        bookings: item.bookings
      }))
    }
    
    const csv = Papa.unparse(dataToExport)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}-report.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-fitness-primary">Reporting & Analytics</h1>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-fitness-primary mb-2">
              Date Range
            </label>
            <Calendar
              value={dateRange}
              onChange={(e) => setDateRange(e.value)}
              selectionMode="range"
              placeholder="Select date range"
              className="w-full"
              showIcon
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-fitness-primary mb-2">
              Report Type
            </label>
            <Dropdown
              value={reportType}
              onChange={(e) => setReportType(e.value)}
              options={reportTypes}
              placeholder="Select report type"
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Export PDF"
              icon="pi pi-file-pdf"
              onClick={exportToPDF}
              className="bg-fitness-accent-secondary hover:bg-fitness-accent"
            />
            <Button
              label="Export CSV"
              icon="pi pi-download"
              onClick={exportToCSV}
              className="bg-fitness-accent hover:bg-fitness-accent-secondary"
            />
          </div>
        </div>
      </Card>

      <TabView>
        <TabPanel header="Overview Charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Monthly Bookings Trend" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart 
                  type="line" 
                  data={{
                    labels: bookingsData.map(item => item.month),
                    datasets: [{
                      label: 'Bookings',
                      data: bookingsData.map(item => item.bookings),
                      backgroundColor: '#21C8B1',
                      borderColor: '#21C8B1',
                      borderWidth: 2,
                      fill: false
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </Card>

            <Card title="Session Popularity" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart type="pie" data={sessionPopularityData} options={pieChartOptions} />
              </div>
            </Card>

            <Card title="Revenue Trend" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart type="line" data={revenueChartData} options={chartOptions} />
              </div>
            </Card>

            <Card title="Client Demographics" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart type="doughnut" data={clientDemographicsData} options={pieChartOptions} />
              </div>
            </Card>
          </div>
        </TabPanel>

        <TabPanel header="Detailed Reports">
          <div className="space-y-6">
            <Card title="Booking Details" className="bg-white shadow-md">
              <DataTable
                value={detailedBookingsReport}
                paginator
                rows={10}
                className="p-datatable-sm"
                emptyMessage="No booking data found"
                responsiveLayout="scroll"
              >
                <Column field="date" header="Date" sortable />
                <Column field="client" header="Client" sortable />
                <Column field="session" header="Session" sortable />
                <Column field="trainer" header="Trainer" sortable />
                <Column field="revenue" header="Revenue ($)" sortable />
              </DataTable>
            </Card>

            <Card title="Trainer Performance" className="bg-white shadow-md">
              <DataTable
                value={trainerPerformanceData}
                className="p-datatable-sm"
                emptyMessage="No trainer data found"
                responsiveLayout="scroll"
              >
                <Column field="trainer" header="Trainer" sortable />
                <Column field="sessions" header="Sessions Conducted" sortable />
                <Column field="revenue" header="Revenue Generated ($)" sortable />
                <Column field="rating" header="Average Rating" sortable />
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        <TabPanel header="Trends Analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Attendance Rate Trend" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart type="line" data={attendanceChartData} options={chartOptions} />
              </div>
            </Card>

            <Card title="Peak Hours Analysis" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart 
                  type="bar" 
                  data={{
                    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
                    datasets: [{
                      label: 'Bookings',
                      data: [15, 25, 20, 18, 22, 30, 35, 28],
                      backgroundColor: '#21C8B1'
                    }]
                  }} 
                  options={chartOptions} 
                />
              </div>
            </Card>

            <Card title="Monthly Revenue vs Bookings" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart 
                  type="bar" 
                  data={{
                    labels: bookingsData.map(item => item.month),
                    datasets: [
                      {
                        label: 'Bookings',
                        data: bookingsData.map(item => item.bookings),
                        backgroundColor: '#21C8B1',
                        yAxisID: 'y'
                      },
                      {
                        label: 'Revenue ($)',
                        data: bookingsData.map(item => item.revenue),
                        backgroundColor: '#AD8654',
                        yAxisID: 'y1'
                      }
                    ]
                  }} 
                  options={{
                    ...chartOptions,
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                          drawOnChartArea: false,
                        },
                      }
                    }
                  }} 
                />
              </div>
            </Card>

            <Card title="Session Type Performance" className="bg-white shadow-md">
              <div style={{ height: '300px' }}>
                <Chart 
                  type="radar" 
                  data={{
                    labels: ['Bookings', 'Revenue', 'Attendance', 'Satisfaction', 'Retention'],
                    datasets: [
                      {
                        label: 'Yoga',
                        data: [85, 90, 95, 92, 88],
                        backgroundColor: 'rgba(33, 200, 177, 0.2)',
                        borderColor: '#21C8B1',
                        borderWidth: 2
                      },
                      {
                        label: 'Cardio',
                        data: [72, 75, 88, 85, 80],
                        backgroundColor: 'rgba(173, 134, 84, 0.2)',
                        borderColor: '#AD8654',
                        borderWidth: 2
                      }
                    ]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              </div>
            </Card>
          </div>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default ReportingAnalytics
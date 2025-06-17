import React, { useMemo, useRef, StrictMode, useEffect, useState, memo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { VscCloudDownload } from 'react-icons/vsc';
import { FaPlus } from 'react-icons/fa6';
import './table.style.css';
import { useLoading } from '../loader/LoaderContext';
import { IoMdArrowRoundBack } from 'react-icons/io';

const NoDataMessage = () => (
  <div className='flex items-center justify-center p-4 bg-gray-200  shadow-md'>
    <span className='text-lg font-bold  text-gray-700'>No data available</span>
  </div>
);

export const Table2 = memo(
  ({
    column = [],
    getTableFunction,
    searchLabel,
    isBack,
    internalRowData,
    setSelectedRow,
    totalCount,
    isExport,
    isExcel,
    sheetName,
    setModalOpen,
    isAdd,
  }) => {
    const exportToExcel = (data, columns) => {
      if (!data || !columns) return;

      // Filter out columns with headerName "Actions"
      const filteredColumns = columns.filter((col) => col.headerName !== 'Actions');

      // Extract headers from filtered columns
      const headers = filteredColumns.map((col) => col.headerName);

      // Extract rows based on filtered columns
      const rows = data.map((row) => filteredColumns.map((col) => row[col.field]));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1');

      // Download Excel file
      XLSX.writeFile(workbook, `${sheetName || 'export'}.xlsx`);
    };

    const exportToPDF = (data, columns) => {
      const doc = new jsPDF();
      doc.autoTable({
        head: [columns.map((col) => col.headerName)],
        body: data.map((row) => columns.map((col) => row[col.field])),
      });
      doc.save(`${sheetName}.pdf`);
    };

    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');
    const tableContainerRef = useRef(null);
    const { handleLoading, isLoading } = useLoading() || {};
    const [sorting, setSorting] = useState([]);

    const columnsWithSerialNo = useMemo(() => {
      const serialColumn = {
        accessorKey: 'serialNo',
        header: 'S.No',
        cell: (info) => info.row.index + 1,
        size: 60,
        enableSorting: false,
      };

      return [
        serialColumn,
        ...column.map((col) => ({
          accessorKey: col.field, // This might need to be accessorFn if col.accessorFn exists
          header: col.headerName,
          cell: (info) => {
            if (col.cellRenderer) {
              return col.cellRenderer({
                value: info.getValue(),
                data: info.row.original,
              });
            }
            return info.getValue();
          },
          // Add these lines to ensure filtering works:
          accessorFn: col.accessorFn, // Pass through the accessorFn from your column definitions
          id: col.field, // Explicit ID helps with filtering
        })),
      ];
    }, [column]);

    useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
        try {
          handleLoading(true);
          setLoading(true);
          const res = await getTableFunction();
          if (isMounted) {
            setRowData(res.data?.data || []);
          }
        } catch (err) {
          if (isMounted) setError(true);
        } finally {
          if (isMounted) setLoading(false);
          handleLoading(false);
        }
      };

      if (getTableFunction) {
        fetchData();
      } else if (internalRowData) {
        setRowData(internalRowData);
        setLoading(false);
      }

      return () => {
        isMounted = false;
      };
    }, [getTableFunction, internalRowData]);

    const table = useReactTable({
      data: rowData,
      columns: columnsWithSerialNo,
      state: { globalFilter, sorting },
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      },
      onGlobalFilterChange: setGlobalFilter,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),

      debugTable: true,
    });

    const onSearchChange = (e) => {
      const value = e.target.value;
      setSearchText(value);
      setGlobalFilter(value);
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const wb = XLSX.read(event.target.result, { type: 'binary' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/your/api/endpoint', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.success) {
            setRowData(result.data);
          } else {
            console.error('Error in backend response', result.message);
          }
        } catch (error) {
          console.error('Error during file upload or API call', error);
        }
      };

      reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
      const headers = column.map((col) => col.headerName);
      const ws = XLSX.utils.aoa_to_sheet([headers]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Template');
      XLSX.writeFile(wb, 'template.xlsx');
    };

    const downloadPDF = () => {
      exportToPDF(rowData, column);
    };

    const onRowClicked = (rowData) => {
      setModalOpen(true);
      setSelectedRow(rowData);
      console.log('Row clicked data:', rowData);
    };

    console.log(isLoading);

    return (
      <main className='common__layout__wrapper'>
        <section className='common__layout__section'>
          <div className='search__section sticky top-0 bg-white z-10 pt-4 pb-4 border-b'>
            <div className='search__filter justify-between'>
              <div className='flex items-center gap-4 '>
                {isBack && (
                  <div className='text-xl flex items-center py-2'>
                    <button
                      className='rounded cursor-pointer'
                      onClick={() => {
                        setSelectedRow(null);
                      }}
                    >
                      <IoMdArrowRoundBack />
                    </button>
                  </div>
                )}
                <div className='flex items-center gap-2 '>
                  <label htmlFor='search-input' className='text-sm font-medium text-gray-700'>
                    {searchLabel ? `${searchLabel}:` : 'Search:'}
                  </label>
                  <div className='search__input__section relative'>
                    <FaSearch
                      className='search__icon absolute left-3transform -translate-y-1/2 text-gray-400'
                      style={{ top: '17px' }}
                    />
                    <input
                      id='search-input'
                      type='text'
                      placeholder='Search...'
                      className='pl-10 pr-4 py-2 border border-gray-300 rounded-md '
                      value={searchText}
                      onChange={onSearchChange}
                    />
                  </div>
                </div>

                {totalCount && (
                  <div className='flex items-center'>
                    <span className='text-sm font-medium text-gray-700'>Total Members:</span>
                    <span className='ml-2 text-lg font-bold text-blue-600'>
                      {rowData?.length || 0}
                    </span>
                  </div>
                )}
              </div>

              <div className='flex items-center gap-4'>
                {isExport && (
                  <>
                    <button
                      onClick={downloadTemplate}
                      className='flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 transition-colors'
                    >
                      <span>Download Template</span>
                      <VscCloudDownload className='text-lg' />
                    </button>

                    <label
                      htmlFor='file-upload'
                      className='flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors cursor-pointer'
                    >
                      <span>Import</span>
                      <VscCloudDownload className='text-lg' />
                    </label>
                    <input
                      id='file-upload'
                      type='file'
                      accept='.xlsx,.xls'
                      onChange={handleFileUpload}
                      className='hidden'
                    />
                  </>
                )}
                {isExcel && (
                  <div className='flex items-center space-x-4 float-right'>
                    {/* Download Button */}
                    <button
                      onClick={() =>
                        exportToExcel(getTableFunction ? rowData : internalRowData, column)
                      }
                      className='flex items-center gap-2 px-2 py-2 bg-primary text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:bg-blue-600 hover:scale-105'
                    >
                      <span>Download Excel Sheet</span>
                      <i>
                        <VscCloudDownload />
                      </i>
                    </button>
                  </div>
                )}
                {isAdd && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className='flex items-center cursor-pointer gap-2 px-4 py-2 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors'
                  >
                    <span>Add New</span>
                    <FaPlus />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='table-container mt-0' ref={tableContainerRef}>
            {rowData.length === 0 ? (
              <NoDataMessage />
            ) : (
              <>
                {handleLoading && handleLoading(false)}
                <div
                  className='table-wrapper border border-gray-200  overflow-hidden'
                  style={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto' }}
                >
                  <table className='w-full divide-y divide-gray-200'>
                    <thead className='sticky top-0 z-10'>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className='bg-white'>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className={`sticky ${
                                header.id === 'actions' ? 'right-0' : ''
                              } px-6 py-3 text-left bg-white`}
                              onClick={header.column.getToggleSortingHandler()}
                              style={{
                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                              }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted()] ?? null}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          // onClick={() => onRowClicked(row.original)}
                          className='hover:bg-gray-50 cursor-pointer transition-colors'
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${
                                cell.column.id === 'actions' ? 'sticky right-0 bg-white' : ''
                              }`}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className='pagination-controls p-4 flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 sticky bottom-0 bg-white py-3 border-t'>
                  <div className='flex items-center gap-2'>
                    <button
                      className='px-3 py-1 border cursor-pointer  border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {'<<'}
                    </button>
                    <button
                      className='px-3 py-1 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      {'<'}
                    </button>
                    <button
                      className='px-3 py-1 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      {'>'}
                    </button>
                    <button
                      className='px-3 py-1 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      {'>>'}
                    </button>
                  </div>

                  <span className='flex items-center gap-1 text-sm text-gray-700'>
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                  </span>

                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-700'>Show:</span>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                      }}
                      className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                    >
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    );
  }
);

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Table2 />
  </StrictMode>
);
window.tearDownExample = () => root.unmount();

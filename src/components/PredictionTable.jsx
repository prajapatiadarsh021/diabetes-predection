import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function PredictionTable({
  predictions,
  onSelectPrediction,
  onDeletePrediction
}) {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let result = [...predictions];

    // Filter by risk category
    if (filterCategory !== 'ALL') {
      result = result.filter((p) => p.riskCategory === filterCategory);
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          (p.patientName && p.patientName.toLowerCase().includes(q)) ||
          p.riskCategory.toLowerCase().includes(q) ||
          String(p.glucose).includes(q) ||
          String(p.age).includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'date') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [predictions, filterCategory, searchTerm, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getBadgeClass = (category) => {
    switch (category) {
      case 'High Risk':
        return 'badge-high';
      case 'Moderate Risk':
        return 'badge-mod';
      case 'Low Risk':
      default:
        return 'badge-low';
    }
  };

  const exportCSV = () => {
    if (predictions.length === 0) {
      showToast('No records available to export', 'error');
      return;
    }

    const headers = [
      'Prediction_ID',
      'Date',
      'Patient_Name',
      'Age',
      'Gender',
      'Glucose_mg_dL',
      'Blood_Pressure_mmHg',
      'Skin_Thickness_mm',
      'Insulin_uU_mL',
      'BMI_kg_m2',
      'Pedigree_Score',
      'Risk_Category',
      'Probability_Pct'
    ];

    const rows = predictions.map((p) => [
      p.id,
      `"${new Date(p.date).toLocaleString()}"`,
      `"${p.patientName || 'Anonymous'}"`,
      p.age,
      p.gender || 'N/A',
      p.glucose,
      p.bloodPressure,
      p.skinThickness,
      p.insulin,
      p.bmi,
      p.pedigree,
      `"${p.riskCategory}"`,
      p.probability
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `diabetes_predictions_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported prediction dataset to CSV successfully', 'success');
  };

  return (
    <div>
      {/* Search, Filter, Sort Controls Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          {/* Search bar */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '340px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search ID, Name, Glucose..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '150px' }}
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Low Risk">Low Risk (&lt;30%)</option>
              <option value="Moderate Risk">Moderate Risk (30-60%)</option>
              <option value="High Risk">High Risk (&gt;60%)</option>
            </select>
          </div>
        </div>

        {/* Export CSV Button */}
        <button className="btn btn-outline btn-sm" onClick={exportCSV} title="Export current data as CSV">
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Content */}
      <div className="data-table-wrapper">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Record ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Date / Time</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Patient</th>
                <th onClick={() => handleSort('age')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Age</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('glucose')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Glucose</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th onClick={() => handleSort('bmi')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>BMI</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Classification</th>
                <th onClick={() => handleSort('probability')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Risk Probability</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {item.id}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.patientName || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{item.gender}</div>
                    </td>
                    <td>{item.age} yrs</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: item.glucose >= 126 ? 'var(--risk-high)' : item.glucose >= 100 ? 'var(--risk-mod)' : 'inherit'
                        }}
                      >
                        {item.glucose} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-light)' }}>mg/dL</span>
                      </span>
                    </td>
                    <td>
                      {item.bmi} <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>kg/m²</span>
                    </td>
                    <td>
                      <span className={`badge ${getBadgeClass(item.riskCategory)}`}>
                        {item.riskCategory}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '45px',
                            height: '6px',
                            backgroundColor: '#f1f5f9',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(item.probability, 100)}%`,
                              height: '100%',
                              backgroundColor:
                                item.probability >= 60
                                  ? 'var(--risk-high)'
                                  : item.probability >= 30
                                  ? 'var(--risk-mod)'
                                  : 'var(--risk-low)'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.probability}%</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onSelectPrediction(item)}
                          title="View complete clinical analysis"
                        >
                          <Eye size={15} />
                        </button>
                        {onDeletePrediction && (
                          <button
                            className="btn-icon"
                            onClick={() => {
                              if (window.confirm(`Delete assessment record ${item.id}?`)) {
                                onDeletePrediction(item.id);
                                showToast(`Deleted record ${item.id}`, 'info');
                              }
                            }}
                            title="Delete record"
                            style={{ color: 'var(--text-light)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--risk-high)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-light)')}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={28} color="var(--text-light)" />
                      <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No matching prediction records found</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Try adjusting your search keyword or clearing the risk level filter.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-main)' }}>{filteredAndSorted.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong style={{ color: 'var(--text-main)' }}>{Math.min(currentPage * itemsPerPage, filteredAndSorted.length)}</strong> of{' '}
            <strong style={{ color: 'var(--text-main)' }}>{filteredAndSorted.length}</strong> entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className="btn-icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn-icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryApi } from "../Api/Category.Api";
import { MasterApi } from "../Api/Master.api";

const FilterPanel = ({ filters, setFilters, onReset }) => {

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sessionTypes, setSessionTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({
    location: false,
    categoryId: false,
    sessionTypeId: false,
  });

  useEffect(() => {
    getAllLocations();
    getAllCategories();
    getAllSessionTypes();
  }, []);

  const getAllLocations = async () => {
    try {
      const res = await MasterApi.getAllLocation();
      const locs = res?.data?.data?.allLocationMasters || [];
      setLocations(
        locs.map((loc) => ({
          id: loc._id,
          name: `${loc.streetName ?? ""}, ${loc.City?.name ?? ""}, ${loc.Country?.name ?? ""}`.replace(/(^[,\s]+)|([,\s]+$)/g, ''),
        }))
      );
    } catch (e) {
      console.error("Failed to load locations", e);
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await CategoryApi.getAllCategory();
      const cats = res?.data?.data || [];
      setCategories(
        cats.map((cat) => ({
          id: cat._id,
          name: cat.cName || "Unnamed Category",
        }))
      );
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  const getAllSessionTypes = async () => {
    try {
      const res = await MasterApi.getAllSession();
      const sess = res?.data?.data || [];
      setSessionTypes(
        sess.map((session) => ({
          id: session._id,
          name: session.sessionName || "Unnamed Session",
        }))
      );
    } catch (e) {
      console.error("Failed to load session types", e);
    }
  };

  const filterOptions = (options) => {
    if (!search) return options;
    return options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  };

  const toggleSelect = (key, id) => {
  const selected = filters[key] || [];
  const updated = selected.includes(id)
    ? selected.filter((val) => val !== id)
    : [...selected, id];

  console.log(`Updating filter[${key}] to:`, updated);

  setFilters((prev) => ({
    ...prev,
    [key]: updated,
    page: 1,
  }));
};


 const renderCheckboxList = (label, key, options) => {
  const filtered = filterOptions(options);
  const isExpanded = expanded[key];

  return (
    <div className="">
      <button
        type="button"
        className="flex items-center justify-between w-full mb-1 focus:outline-none"
        onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
      >
        <span className="font-semibold text-gray-800 text-sm">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isExpanded ? "rotate-0" : "-rotate-90"
          }`}
        />
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-2 pl-2 max-h-48 overflow-auto mt-1">
          {filtered.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2 text-gray-700 text-sm"
            >
              <input
                type="checkbox"
                checked={(filters[key] || []).includes(option.id)}
                onChange={() => toggleSelect(key, option.id)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>{option.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};


  const hasActiveFilters = Object.entries(filters).some(([k, v]) =>
    Array.isArray(v) ? v.length > 0 : v !== "" && v !== false && v != null
  );

  return (
    <div className="w-full p-3 md:p-5 bg-white rounded-xl shadow border border-gray-200 flex flex-col gap-6 max-w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg text-gray-900">FILTERS</h2>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setFilters(prev => ({
                ...prev,
                isSingleClass: '',
                isExpired: '',
                location: [],
                categoryId: [],
                sessionTypeId: [],
                page: 1,
              }));
              if (onReset) onReset();
            }}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Toggle buttons for isSingleClass and isExpired */}
      <div className="flex flex-wrap gap-4 mb-2 w-full">
        {/* isSingleClass toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Class Type:</span>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isSingleClass === '' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isSingleClass: '', page: 1 }))}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isSingleClass === true ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isSingleClass: true, page: 1 }))}
          >
            Single
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isSingleClass === false ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isSingleClass: false, page: 1 }))}
          >
            Range
          </button>
        </div>
        {/* isExpired toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isExpired === '' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isExpired: '', page: 1 }))}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isExpired === false ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isExpired: false, page: 1 }))}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 rounded-full border text-sm ${filters.isExpired === true ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-300 text-gray-700'}`}
            onClick={() => setFilters(prev => ({ ...prev, isExpired: true, page: 1 }))}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Render dynamic filters */}
      <div className="flex flex-col gap-4 w-full">
        <div className="max-h-48 overflow-auto w-full">{renderCheckboxList("Location", "location", locations)}</div>
        <div className="max-h-48 overflow-auto w-full">{renderCheckboxList("Category", "categoryId", categories)}</div>
        <div className="max-h-48 overflow-auto w-full">{renderCheckboxList("Session Type", "sessionTypeId", sessionTypes)}</div>
      </div>
    </div>
  );
};

export default FilterPanel;

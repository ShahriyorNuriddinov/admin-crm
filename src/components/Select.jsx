import { useEffect, useState } from "react";

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Tanlang",
  name,
  disabled = false,
  multiple = false,
  asyncSearch = false,
  onSearch,
}) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(options);

  useEffect(() => {
    if (asyncSearch && onSearch) {
      const delay = setTimeout(async () => {
        const res = await onSearch(search);
        setData(res || []);
      }, 400);

      return () => clearTimeout(delay);
    }
  }, [search]);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {asyncSearch && (
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Qidirish..."
          className="mb-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        multiple={multiple}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md outline-none
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          focus:ring-2 focus:ring-blue-500`}
      >
        {!multiple && <option value="">{placeholder}</option>}

        {data.map((opt) => (
          <option
            key={opt.value ?? opt.id}
            value={opt.value ?? opt.id}
          >
            {opt.label ?? opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

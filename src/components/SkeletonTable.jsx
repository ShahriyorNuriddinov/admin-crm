import SkeletonTable from "../../components/SkeletonTable";
{loading ? <SkeletonTable /> : <Table columns={columns} data={teachers} />}
const SkeletonTable = ({ columns = 6, rows = 5 }) => {
  return (
    <div className="border rounded-lg shadow-sm p-4 animate-pulse">
      <div className="flex gap-4 mb-6">
        {Array.from({ length: columns }).map((_, i) => (
          <div 
            key={i} 
            className={`h-8 bg-gray-200 rounded ${
              i < columns - 1 ? 'flex-1' : 'w-40'
            }`}
          />
        ))}
      </div>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 mb-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-10 bg-gray-100 rounded ${
                colIndex < columns - 2 ? 'flex-1' : 
                colIndex === columns - 2 ? 'w-24' : 'w-40'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

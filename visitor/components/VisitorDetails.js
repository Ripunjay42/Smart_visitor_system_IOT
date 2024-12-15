import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from './FirebaseConfig';

const VisitorDetails = () => {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const visitorRef = ref(db, 'visitors');
    const unsubscribe = onValue(visitorRef, (snapshot) => {
      const data = snapshot.val();
      const visitorData = Object.values(data)
        .flatMap((item) => Object.values(item))
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order
      setVisitors(visitorData);
    });

    return unsubscribe;
  }, []);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'checked_in':
        return 'text-green-500'; // Green for checked_in
      case 'checked_out':
        return 'text-red-500'; // Red for checked_out
      default:
        return 'text-gray-500'; // Gray for default
    }
  };

  return (
    <div className="overflow-x-auto max-h-[800px] md:max-h-[800px] overflow-y-auto border border-violet-300 rounded p-2 custom-scrollbar">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <table className="w-full md:max-w-7xl mx-auto border-collapse bg-gradient-to-b from-gray-100 to-gray-200">
        <thead>
          <tr>
            <th className="hidden md:table-cell px-1 md:px-4 py-2 md:py-3 border-2 text-left border-black text-sm md:text-lg leading-3 font-bold text-green-500 uppercase tracking-wider">
              UID
            </th>
            <th className="px-1 md:px-4 py-2 border-2 text-left border-black text-xs md:text-lg leading-3 font-bold text-green-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-1 md:px-4 py-2 border-2 text-left border-black text-xs md:text-lg leading-3 bold text-green-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor, index) => (
            <tr key={index}>
              <td className="hidden md:table-cell text-xs md:text-lg px-1 md:px-4 py-2 whitespace-no-wrap border font-semibold border-gray-900">
                {visitor.uid}
              </td>
              <td className="px-1 md:px-4 py-2 text-xs md:text-lg font-semibold whitespace-no-wrap border border-gray-900">
                {new Date(visitor.timestamp * 1000).toLocaleString()}
              </td>
              <td className={`px-1 md:px-4 py-2 text-xs md:text-lg font-semibold whitespace-no-wrap border border-gray-900 ${getStatusColor(visitor.status)}`}>
                {visitor.status.replace('_', ' ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorDetails;

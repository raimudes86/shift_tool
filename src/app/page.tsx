"use client";
import { useState, useEffect } from 'react';

const startTimeOptions = ['10', '17', '11', '18', '18.5','9','10.5','11.5','19'];
const endTimeOptions = ['15', 'L', '14', '14.5','17','19'];

const ShiftButton = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 border ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-blue-500 hover:text-white transition-colors duration-300 ease-in-out rounded mr-2 mb-2`}
    >
      {label}
    </button>
  );
};

const ShiftPage = () => {
  const today = new Date();
  const todays_year = today.getFullYear();
  const next_month = today.getDate() < 15 ? today.getMonth()+1 : today.getMonth()+2;
  const next_half = today.getDate() < 15 ? "後半" : "前半";
  const [year, setYear] = useState(String(todays_year));
  const [month, setMonth] = useState(String(next_month));
  const [half, setHalf] = useState(next_half);
  const [days, setDays] = useState<{date: string, youbi: string}[]>([]);
  const [shifts, setShifts] = useState<{ day: string, auto: string, start: string, end: string, youbi: string }[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const updateDays = () => {
    const maxDay = new Date(Number(year), Number(month), 0).getDate();
    const startDay = half === '前半' ? 1 : 16;
    const lastDay = half === '前半' ? 15 : maxDay;
    const daysOfSet = ['日','月','火','水', '木', '金', '土'];
    const newDays = Array.from({ length: lastDay - startDay + 1 }, (_, i) =>{
      const currentDate = new Date(Number(year), Number(month)-1, startDay + i );
      const date = currentDate.getDate();
      const youbi = daysOfSet[currentDate.getDay()];
      return {date: String(date), youbi};
    });
    setDays(newDays);

    const initialShifts = newDays.map(day => ({ day: day.date , auto: '', start: '', end: '', youbi: day.youbi }));
    setShifts(initialShifts);
  };

  useEffect(() => {
    updateDays();
  }, [year, month, half]);

  const handleShiftChange = (index: number, type: 'start' | 'end' | 'auto', value: string) => {
    const updatedShifts = [...shifts];
    updatedShifts[index]['auto'] = '';
    updatedShifts[index][type] = value;
    setShifts(updatedShifts);
  };

  const generateCopyText = () => {
    return shifts
      .filter(shift => shift.start && shift.end)
      .map(shift => `${shift.day}日(${shift.youbi}) ${shift.start}~${shift.end}`)
      .join('\n') + '\nお願いします！';
  };

  const generateYearOptions = () => {
    const years = [];
    for (let i = 2024; i <= 2050; i++) {
      years.push(i);
    }
    return years;
  };

  const handleCopy = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  const months = [
    { value: '01', label: '1月' },
    { value: '02', label: '2月' },
    { value: '03', label: '3月' },
    { value: '04', label: '4月' },
    { value: '05', label: '5月' },
    { value: '06', label: '6月' },
    { value: '07', label: '7月' },
    { value: '08', label: '8月' },
    { value: '09', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-center">「青山がらり」<p>シフトコピーツール</p></h1>

      {/* 年度、月、前半・後半の選択 */}
      <div className="flex space-x-4 mb-8 justify-center">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">年度</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded shadow">
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">月</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded shadow">
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-semibold">前半/後半</label>
          <select value={half} onChange={(e) => setHalf(e.target.value)} className="p-2 border border-gray-300 rounded shadow">
            <option value="前半">前半</option>
            <option value="後半">後半</option>
          </select>
        </div>
      </div>

      {/* 説明文 */}
      <p className="text-gray-600 text-center mb-6">テンプレを押すか自分で時間を選択してください。最後に一番下のコピーボタンを押してください。</p>

      {/* シフト設定 */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-4 text-left">日付</th>
            <th className="border border-gray-300 p-4 text-left">テンプレ</th>
            <th className="border border-gray-300 p-4 text-left">開始時間</th>
            <th className='border border-gray-300 p-4 text-left'></th>
            <th className="border border-gray-300 p-4 text-left">終了時間</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={day.date} className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
              <td className="border border-gray-300 p-4">{day.date}日({day.youbi})</td>
              <td className="border border-gray-300 p-4 ">
                <div className="flex flex-col sm:flex-row">
                  <ShiftButton
                    label="昼"
                    selected={shifts[index].auto === '昼'}
                    onClick={() => {
                      handleShiftChange(index, 'start','10');
                      handleShiftChange(index, 'end', '15');
                      handleShiftChange(index, 'auto', '昼');
                    }}
                  />
                  <ShiftButton
                    label="夜"
                    selected={shifts[index].auto === '夜'}
                    onClick={() => {
                      handleShiftChange(index, 'start','17');
                      handleShiftChange(index, 'end', 'L');
                      handleShiftChange(index, 'auto', '夜');
                    }}
                  />
                  <ShiftButton
                    label="通し"
                    selected={shifts[index].auto === '通し'}
                    onClick={() => {
                      handleShiftChange(index, 'start','10');
                      handleShiftChange(index, 'end', 'L');
                      handleShiftChange(index, 'auto', '通し');
                    }}
                  />
                </div>
              </td>

              <td className="border border-gray-300 p-4">
                <div className="flex flex-col sm:flex-row">
                  <ShiftButton
                    label="10"
                    selected={shifts[index].start === '10'}
                    onClick={() => handleShiftChange(index, 'start','10')}
                  />
                  <ShiftButton
                    label="17"
                    selected={shifts[index].start === '17'}
                    onClick={() => handleShiftChange(index, 'start','17')}
                  />
                  <select
                    value={shifts[index].start}
                    onChange={(e) => handleShiftChange(index, 'start', e.target.value)}
                    className="p-2 border border-gray-300 rounded mt-2 bg-white"
                  >
                    <option value="">その他</option>
                    {startTimeOptions
                      .filter((time) => time !== '10' && time !== '17')
                      .map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              </td>

              <td className="border border-gray-300 p-4 text-center">〜</td>

              <td className="border border-gray-300 p-4">
                <div className="flex flex-col sm:flex-row">
                  <ShiftButton
                    label="15"
                    selected={shifts[index].end === '15'}
                    onClick={() => handleShiftChange(index, 'end','15')}
                  />
                  <ShiftButton
                    label="L"
                    selected={shifts[index].end === 'L'}
                    onClick={() => handleShiftChange(index, 'end','L')}
                  />
                  <select
                    value={shifts[index].end}
                    onChange={(e) => handleShiftChange(index, 'end', e.target.value)}
                    className="p-2 border border-gray-300 rounded mt-2 bg-white"
                  >
                    <option value="">その他</option>
                    {endTimeOptions
                      .filter((time) => time !== '15' && time !== 'L')
                      .map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* コピー機能 */}
      <div className="mt-8">
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateCopyText());
            handleCopy();
          }}
          className="bg-blue-600 text-white w-full py-4 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          コピー
        </button>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <p className="text-lg font-semibold">コピーされました！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftPage;

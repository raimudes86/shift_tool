"use client";
import { useState, useEffect } from 'react';

// 時間選択肢
const startTimeOptions = ['10', '17', '11', '18', '18.5','9','10.5','11.5'];
const endTimeOptions = ['15', 'L', '14', '14.5','17'];

const ShiftPage = () => {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('10');
  const [half, setHalf] = useState('前半');
  const [days, setDays] = useState<string[]>([]);
  const [shifts, setShifts] = useState<{ day: string, start: string, end: string }[]>([]);

  // 年度・月が変更されたときに、日付を取得
  const updateDays = () => {
    const maxDay = new Date(Number(year), Number(month), 0).getDate();
    const startDay = half === '前半' ? 1 : 16;
    const lastDay = half === '前半' ? 15 : maxDay;
    const newDays = Array.from({ length: lastDay - startDay + 1 }, (_, i) => (startDay + i).toString());
    setDays(newDays);

    // 初期のシフトデータも更新
    const initialShifts = newDays.map(day => ({ day, start: '', end: '' }));
    setShifts(initialShifts);
  };

  // ページロード時と、年、月、半期が変更されたときに日付を更新
  useEffect(() => {
    updateDays();
  }, [year, month, half]);

  // シフトの時間を変更する
  const handleShiftChange = (index: number, type: 'start' | 'end', value: string) => {
    const updatedShifts = [...shifts];
    updatedShifts[index][type] = value;
    setShifts(updatedShifts);
  };

  // コピー用のテキストを生成
  const generateCopyText = () => {
    return shifts
      .filter(shift => shift.start && shift.end)
      .map(shift => `${shift.day}日\t${shift.start}~${shift.end}`)
      .join('\n');
  };

  // 年の選択肢を2024年から2050年まで生成
  const generateYearOptions = () => {
    const years = [];
    for (let i = 2024; i <= 2050; i++) {
      years.push(i);
    }
    return years;
  };

  // 月の選択肢
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">シフト作成</h1>

      {/* 年度、月、前半・後半の選択 */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label>年度</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded">
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>月</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded">
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>前半/後半</label>
          <select value={half} onChange={(e) => setHalf(e.target.value)} className="p-2 border border-gray-300 rounded">
            <option value="前半">前半</option>
            <option value="後半">後半</option>
          </select>
        </div>
      </div>

      {/* 日付ごとのシフト設定 */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">日付</th>
            <th className="border border-gray-300 p-2">開始時間</th>
            <th className="border border-gray-300 p-2">終了時間</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={day}>
              <td className="border border-gray-300 p-2">{day}日</td>
              <td className="border border-gray-300 p-2">
                {/* 最初に固定された2つの選択肢 */}
                <button
                  onClick={() => handleShiftChange(index, 'start', '10')}
                  className={`p-2 border ${shifts[index].start === '10' ? 'bg-blue-500 text-white' : 'border-gray-300' } rounded mt-5`}
                >
                  10
                </button>
                <button
                  onClick={() => handleShiftChange(index, 'start', '17')}
                  className={`p-2 border ${shifts[index].start === '17' ? 'bg-blue-500 text-white' : 'border-gray-300'} rounded`}
                >
                  17
                </button>
                {/* その他の選択肢をプルダウンで表示 */}
                <select
                  value={shifts[index].start}
                  onChange={(e) => handleShiftChange(index, 'start', e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">他の時間を選択</option>
                  {startTimeOptions
                    .filter((time) => time !== '10' && time !== '17') // 既にボタンで表示されているものは除く
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                {/* 終了時間も同様に設定 */}
                <button
                  onClick={() => handleShiftChange(index, 'end', '15')}
                  className={`p-2 border ${shifts[index].end === '15' ? 'bg-blue-500 text-white' : 'border-gray-300'} rounded`}
                >
                  15
                </button>
                <button
                  onClick={() => handleShiftChange(index, 'end', 'L')}
                  className={`p-2 border ${shifts[index].end === 'L' ? 'bg-blue-500 text-white' : 'border-gray-300'} rounded`}
                >
                  L
                </button>
                {/* その他の選択肢をプルダウンで表示 */}
                <select
                  value={shifts[index].end}
                  onChange={(e) => handleShiftChange(index, 'end', e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">他の時間を選択</option>
                  {endTimeOptions
                    .filter((time) => time !== '15' && time !== 'L') // 既にボタンで表示されているものは除く
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* コピー機能 */}
      <div className="mt-4">
        <button
          onClick={() => navigator.clipboard.writeText(generateCopyText())}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          コピー
        </button>
      </div>
    </div>
  );
};

export default ShiftPage;
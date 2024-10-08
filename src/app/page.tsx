"use client";
import { useState, useEffect } from 'react';

// 時間選択肢
const startTimeOptions = ['10', '17', '11', '18', '18.5','9','10.5','11.5','19'];
const endTimeOptions = ['15', 'L', '14', '14.5','17','19'];

const ShiftButton = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 border ${selected ? label === '昼'|| label === '夜'|| label === '通し' ? 'bg-gray-600 text-white' : 'bg-blue-500 text-white' : label === '昼'|| label === '夜'|| label === '通し' ? 'bg-gray-400 text-white' : 'border-gray-300'} rounded mr-2`}
    >
      {label}
    </button>
  );
};


const ShiftPage = () => {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('10');
  const [half, setHalf] = useState('前半');
  const [days, setDays] = useState<string[]>([]);
  const [shifts, setShifts] = useState<{ day: string, auto: string, start: string, end: string }[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  // 年度・月が変更されたときに、日付を取得
  const updateDays = () => {
    const maxDay = new Date(Number(year), Number(month), 0).getDate();
    const startDay = half === '前半' ? 1 : 16;
    const lastDay = half === '前半' ? 15 : maxDay;
    const newDays = Array.from({ length: lastDay - startDay + 1 }, (_, i) => (startDay + i).toString());
    setDays(newDays);

    // 初期のシフトデータも更新
    const initialShifts = newDays.map(day => ({ day, auto: '', start: '', end: '' }));
    setShifts(initialShifts);
  };

  // ページロード時と、年、月、半期が変更されたときに日付を更新
  useEffect(() => {
    updateDays();
  }, [year, month, half]);

  // シフトの時間を変更する
  const handleShiftChange = (index: number, type: 'start' | 'end' | 'auto', value: string) => {
    const updatedShifts = [...shifts];
    updatedShifts[index]['auto'] = '';
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

  //コピーされたことを表示する関数
  const handleCopy = () => {
    setShowPopup(true);
    //2秒後にメッセージを消す
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
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
      <h1 className="text-2xl font-bold mb-4">「青山がらり」シフトコピーツール</h1>

      {/* 年度、月、前半・後半の選択 */}
      <div className="flex space-x-4 mb-4">
        <div className="flex flex-col">
          <label>年度</label>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded">
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label>月</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded">
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label>前半/後半</label>
          <select value={half} onChange={(e) => setHalf(e.target.value)} className="p-2 border border-gray-300 rounded">
            <option value="前半">前半</option>
            <option value="後半">後半</option>
          </select>
        </div>
      </div>
      <p>テンプレのどれかを押すとデフォルトで(昼→10〜15,夜→17〜L,通し→10〜L)が選択されます。</p>
      <p>※最後に一番下のコピーボタンを押すとコピーされています</p>

      {/* 日付ごとのシフト設定 */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">日付</th>
            <th className="border border-gray-300 p-2">テンプレ</th>
            <th className="border border-gray-300 p-2">開始時間</th>
            <th className='border border-gray-300 p-2'></th>
            <th className="border border-gray-300 p-2">終了時間</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={day}>
              <td className="border border-gray-300 p-2 ">{day}日</td>
              <td className="border border-gray-300 p-2">
                <div className='flex flex-col'>
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

              <td className="border border-gray-300 p-2">
                {/* 最初に固定された2つの選択肢 */}
                <div className='flex flex-col'>
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
                  {/* その他の選択肢をプルダウンで表示 */}
                  <select
                    value={shifts[index].start}
                    onChange={(e) => handleShiftChange(index, 'start', e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="">その他</option>
                    {startTimeOptions
                      .filter((time) => time !== '10' && time !== '17') // 既にボタンで表示されているものは除く
                      .map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              </td>

              <td  className="border border-gray-300">
                <p className="text-center">〜</p>
              </td>

              <td className="border border-gray-300 p-2">
                  {/* 終了時間も同様に設定 */}
                <div className='flex flex-col'>
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
                  {/* その他の選択肢をプルダウンで表示 */}
                  <select
                    value={shifts[index].end}
                    onChange={(e) => handleShiftChange(index, 'end', e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="">その他</option>
                    {endTimeOptions
                      .filter((time) => time !== '15' && time !== 'L') // 既にボタンで表示されているものは除く
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
      <div className="mt-4 relative">
        <button
          onClick={() => {
            navigator.clipboard.writeText(generateCopyText());
            handleCopy();
          }}
          className="bg-blue-500 text-white min-w-full h-16 rounded hover:bg-blue-700"
        >
          コピー
        </button>
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg text-center">
              <p className="text-lg font-semibold">コピーされました！</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShiftPage;
// import { useState, useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";

// interface DatePickerProps {
//   value: string;
//   onChange: (date: string) => void;
//   placeholder?: string;
//   className?: string;
//   required?: boolean;
// }

// const DatePicker: React.FC<DatePickerProps> = ({
//   value,
//   onChange,
//   placeholder,
//   className = "",
//   required = false
// }) => {
//   const { t } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [selectedDate, setSelectedDate] = useState<{
//     day: number;
//     month: number;
//     year: number;
//   }>(() => {
//     if (value) {
//       const date = new Date(value);
//       return {
//         day: date.getDate(),
//         month: date.getMonth() + 1,
//         year: date.getFullYear()
//       };
//     }
//     const now = new Date();
//     return {
//       day: now.getDate(),
//       month: now.getMonth() + 1,
//       year: now.getFullYear()
//     };
//   });

//   const [currentView, setCurrentView] = useState<'day' | 'month' | 'year'>('day');
//   const [hoveredDate, setHoveredDate] = useState<{day: number, month: number, year: number} | null>(null);
//   const [forceUpdate, setForceUpdate] = useState(0);

//   // Используем нидерландское время (Europe/Amsterdam)
//   const getNetherlandsDate = () => {
//     const now = new Date();
//     return new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
//   };
  
//   const netherlandsDate = getNetherlandsDate();
//   const currentYear = netherlandsDate.getFullYear();
//   const currentMonth = netherlandsDate.getMonth() + 1;
//   const currentDay = netherlandsDate.getDate();
//   const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
//   const months = [
//     { value: 1, name: t("registration.datePicker.months.january") || "January" },
//     { value: 2, name: t("registration.datePicker.months.february") || "February" },
//     { value: 3, name: t("registration.datePicker.months.march") || "March" },
//     { value: 4, name: t("registration.datePicker.months.april") || "April" },
//     { value: 5, name: t("registration.datePicker.months.may") || "May" },
//     { value: 6, name: t("registration.datePicker.months.june") || "June" },
//     { value: 7, name: t("registration.datePicker.months.july") || "July" },
//     { value: 8, name: t("registration.datePicker.months.august") || "August" },
//     { value: 9, name: t("registration.datePicker.months.september") || "September" },
//     { value: 10, name: t("registration.datePicker.months.october") || "October" },
//     { value: 11, name: t("registration.datePicker.months.november") || "November" },
//     { value: 12, name: t("registration.datePicker.months.december") || "December" }
//   ];

//   const getDaysInMonth = (month: number, year: number) => {
//     return new Date(year, month, 0).getDate();
//   };

//   const days = Array.from(
//     { length: getDaysInMonth(selectedDate.month, selectedDate.year) },
//     (_, i) => i + 1
//   );

//   useEffect(() => {
//     if (value) {
//       // Парсим дату в формате YYYY-MM-DD напрямую, избегая проблем с часовыми поясами
//       const dateParts = value.split('-');
//       if (dateParts.length === 3) {
//         const year = parseInt(dateParts[0]);
//         const month = parseInt(dateParts[1]);
//         const day = parseInt(dateParts[2]);
        
//         const newSelectedDate = {
//           day: day,
//           month: month,
//           year: year
//         };
        
//         console.log('DatePicker: Синхронизация с внешним значением:', { value, newSelectedDate });
        
//         setSelectedDate(newSelectedDate);
//         setForceUpdate(prev => prev + 1);
//       } else {
//         // Fallback к старому методу, если формат не YYYY-MM-DD
//         const date = new Date(value);
//         const newSelectedDate = {
//           day: date.getDate(),
//           month: date.getMonth() + 1,
//           year: date.getFullYear()
//         };
        
//         console.log('DatePicker: Синхронизация с внешним значением (fallback):', { value, newSelectedDate });
        
//         setSelectedDate(newSelectedDate);
//         setForceUpdate(prev => prev + 1);
//       }
//     } else {
//       // Если значение пустое, сбрасываем к текущей дате
//       const now = getNetherlandsDate();
//       setSelectedDate({
//         day: now.getDate(),
//         month: now.getMonth() + 1,
//         year: now.getFullYear()
//       });
//       setForceUpdate(prev => prev + 1);
//     }
//   }, [value]);

//   // Закрытие календаря при клике вне компонента и поддержка клавиатуры
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (!isOpen) return;
      
//       switch (event.key) {
//         case 'Escape':
//           setIsOpen(false);
//           break;
//         case 'ArrowLeft':
//           if (currentView === 'day') {
//             const newMonth = selectedDate.month === 1 ? 12 : selectedDate.month - 1;
//             const newYear = selectedDate.month === 1 ? selectedDate.year - 1 : selectedDate.year;
//             setSelectedDate(prev => ({ ...prev, month: newMonth, year: newYear }));
//           }
//           break;
//         case 'ArrowRight':
//           if (currentView === 'day') {
//             const newMonth = selectedDate.month === 12 ? 1 : selectedDate.month + 1;
//             const newYear = selectedDate.month === 12 ? selectedDate.year + 1 : selectedDate.year;
//             if (isMonthSelectable(newMonth, newYear)) {
//               setSelectedDate(prev => ({ ...prev, month: newMonth, year: newYear }));
//             }
//           }
//           break;
//         case 'ArrowUp':
//           if (currentView === 'day') {
//             setCurrentView('month');
//           } else if (currentView === 'month') {
//             setCurrentView('year');
//           }
//           break;
//         case 'ArrowDown':
//           if (currentView === 'year') {
//             setCurrentView('month');
//           } else if (currentView === 'month') {
//             setCurrentView('day');
//           }
//           break;
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleKeyDown);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [isOpen, currentView, selectedDate]);

//   const handleDateSelect = (day: number, month: number, year: number) => {
//     if (!isDaySelectable(day, month, year)) return;
    
//     // Создаем дату в локальном часовом поясе, избегая проблем с UTC
//     const newDate = new Date(year, month - 1, day, 12, 0, 0, 0); // Устанавливаем полдень для избежания проблем с часовыми поясами
//     const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
//     console.log('DatePicker: Выбрана дата:', { day, month, year });
//     console.log('DatePicker: Созданная дата:', newDate);
//     console.log('DatePicker: Отформатированная дата:', formattedDate);
    
//     // Обновляем локальное состояние
//     setSelectedDate({ day, month, year });
    
//     // Вызываем onChange с правильной датой
//     onChange(formattedDate);
    
//     // Закрываем календарь
//     setIsOpen(false);
    
//     // Принудительно обновляем отображение
//     setForceUpdate(prev => prev + 1);
    
//     setTimeout(() => {
//       console.log('DatePicker: Синхронизация завершена');
//     }, 100);
//   };

//   const handleYearSelect = (year: number) => {
//     if (!isYearSelectable(year)) return;
//     setSelectedDate(prev => ({ ...prev, year }));
//     setCurrentView('month');
//   };

//   const handleMonthSelect = (month: number) => {
//     if (!isMonthSelectable(month, selectedDate.year)) return;
//     setSelectedDate(prev => ({ ...prev, month }));
//     setCurrentView('day');
//   };

//   const formatDisplayDate = () => {
//     if (!value) return placeholder || t("registration.datePicker.placeholder");
    
//     try {
//       // Парсим дату в формате YYYY-MM-DD напрямую, избегая проблем с часовыми поясами
//       const dateParts = value.split('-');
//       if (dateParts.length === 3) {
//         const year = parseInt(dateParts[0]);
//         const month = parseInt(dateParts[1]);
//         const day = parseInt(dateParts[2]);
        
//         const formattedDate = `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
//         console.log('DatePicker: Отображение даты:', { value, formattedDate });
        
//         return formattedDate;
//       }
      
//       // Fallback к старому методу, если формат не YYYY-MM-DD
//       const date = new Date(value);
//       if (isNaN(date.getTime())) {
//         console.warn('DatePicker: Неверная дата:', value);
//         return placeholder || t("registration.datePicker.placeholder");
//       }
      
//       const day = date.getDate().toString().padStart(2, '0');
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const year = date.getFullYear();
      
//       const formattedDate = `${day}.${month}.${year}`;
//       console.log('DatePicker: Отображение даты (fallback):', { value, formattedDate });
      
//       return formattedDate;
//     } catch (error) {
//       console.error('DatePicker: Ошибка форматирования даты:', error);
//       return placeholder || t("registration.datePicker.placeholder");
//     }
//   };

//   const formatSelectedDate = () => {
//     if (!value) return {
//       day: '',
//       month: '',
//       year: '',
//       fullDate: ''
//     };
    
//     try {
//       // Парсим дату в формате YYYY-MM-DD напрямую, избегая проблем с часовыми поясами
//       const dateParts = value.split('-');
//       if (dateParts.length === 3) {
//         const year = parseInt(dateParts[0]);
//         const month = parseInt(dateParts[1]);
//         const day = parseInt(dateParts[2]);
        
//         const result = {
//           day: day.toString().padStart(2, '0'),
//           month: month.toString().padStart(2, '0'),
//           year: year.toString(),
//           fullDate: `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`
//         };
        
//         console.log('DatePicker: Форматирование выбранной даты:', { value, result });
        
//         return result;
//       }
      
//       // Fallback к старому методу, если формат не YYYY-MM-DD
//       const date = new Date(value);
//       if (isNaN(date.getTime())) {
//         console.warn('DatePicker: Неверная дата для formatSelectedDate:', value);
//         return {
//           day: '',
//           month: '',
//           year: '',
//           fullDate: ''
//         };
//       }
      
//       const day = date.getDate();
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
      
//       const result = {
//         day: day.toString().padStart(2, '0'),
//         month: month.toString().padStart(2, '0'),
//         year: year.toString(),
//         fullDate: `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`
//       };
      
//       console.log('DatePicker: Форматирование выбранной даты (fallback):', { value, result });
      
//       return result;
//     } catch (error) {
//       console.error('DatePicker: Ошибка форматирования выбранной даты:', error);
//       return {
//         day: '',
//         month: '',
//         year: '',
//         fullDate: ''
//       };
//     }
//   };

//   const getYearRange = (year: number) => {
//     const startYear = Math.floor(year / 20) * 20;
//     return Array.from({ length: 20 }, (_, i) => startYear + i);
//   };

//   // Проверка, можно ли выбрать год (используем нидерландское время)
//   const isYearSelectable = (year: number) => {
//     return year <= currentYear;
//   };

//   // Проверка, можно ли выбрать месяц (используем нидерландское время)
//   const isMonthSelectable = (month: number, year: number) => {
//     if (year < currentYear) return true;
//     if (year === currentYear) return month <= currentMonth;
//     return false;
//   };

//   // Проверка, можно ли выбрать день (используем нидерландское время)
//   const isDaySelectable = (day: number, month: number, year: number) => {
//     if (year < currentYear) return true;
//     if (year === currentYear && month < currentMonth) return true;
//     if (year === currentYear && month === currentMonth) return day <= currentDay;
//     return false;
//   };

//   return (
//     <div className={`date-picker ${className}`} ref={containerRef} key={forceUpdate}>
//       <div className="date-picker__input-container">
//         <div className="date-picker__input-wrapper">
//           <input
//             type="text"
//             name="birthDate"
//             className="form__input date-picker__input"
//             value={formatDisplayDate()}
//             placeholder={placeholder || t("registration.datePicker.placeholder")}
//             readOnly
//             onClick={() => setIsOpen(!isOpen)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
//                 e.preventDefault();
//                 setIsOpen(true);
//               }
//             }}
//             autoComplete="bday"
//             required={required}
//             key={`input-${forceUpdate}`}
//             aria-label={t("registration.datePicker.ariaLabel") || "Выберите дату"}
//             aria-expanded={isOpen}
//             aria-haspopup="dialog"
//             role="combobox"
//             style={{
//               cursor: 'pointer',
//               backgroundColor: value ? '#f8f9fa' : '#ffffff',
//               borderColor: value ? '#28a745' : '#ced4da',
//               fontWeight: value ? '600' : '400',
//               color: value ? '#155724' : '#495057',
//               transition: 'all 0.3s ease',
//               paddingRight: '50px'
//             }}
//           />
//           <div className="date-picker__input-icon" aria-hidden="true">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
//               <line x1="16" y1="2" x2="16" y2="6"/>
//               <line x1="8" y1="2" x2="8" y2="6"/>
//               <line x1="3" y1="10" x2="21" y2="10"/>
//             </svg>
//           </div>
//         </div>
//         {value && (
//           <div className="date-picker__selected-info" key={`info-${forceUpdate}`}>
//               <div className="date-picker__selected-date">
//               <span className="date-picker__selected-icon">✓</span>
//               {t("registration.datePicker.selected")}: {formatSelectedDate().fullDate}
//             </div>
//             <div className="date-picker__selected-parts">
//               <span className="date-picker__day-part">
//                 <span className="date-picker__part-label">{t("registration.datePicker.day")}</span>
//                 <span className="date-picker__part-value">{formatSelectedDate().day}</span>
//               </span>
//               <span className="date-picker__month-part">
//                 <span className="date-picker__part-label">{t("registration.datePicker.month")}</span>
//                 <span className="date-picker__part-value">{formatSelectedDate().month}</span>
//               </span>
//               <span className="date-picker__year-part">
//                 <span className="date-picker__part-label">{t("registration.datePicker.year")}</span>
//                 <span className="date-picker__part-value">{formatSelectedDate().year}</span>
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {isOpen && (
//         <div 
//           className="date-picker__dropdown"
//           role="dialog"
//           aria-modal="true"
//           aria-label={t("registration.datePicker.dialogLabel") || "Календарь для выбора даты"}
//         >
//           <div className="date-picker__header">
//             <div className="date-picker__title">
//               {currentView === 'day' && (
//                 <div className="date-picker__title-content">
//                   <div className="date-picker__title-main">
//                     {months[selectedDate.month - 1].name} {selectedDate.year}
//                   </div>
//                   {value && (
//                     <div className="date-picker__title-selected" key={`title-${forceUpdate}`}>
//                       {t("registration.datePicker.selected")}: {formatSelectedDate().fullDate}
//                     </div>
//                   )}
//                 </div>
//               )}
//               {currentView === 'month' && selectedDate.year}
//               {currentView === 'year' && `${Math.floor(selectedDate.year / 20) * 20}-${Math.floor(selectedDate.year / 20) * 20 + 19}`}
//             </div>
//             <div className="date-picker__controls">
//               {currentView === 'day' && (
//                 <>
//                   <button
//                     type="button"
//                     className="date-picker__nav-btn date-picker__nav-btn--prev"
//                     onClick={() => {
//                       const newMonth = selectedDate.month === 1 ? 12 : selectedDate.month - 1;
//                       const newYear = selectedDate.month === 1 ? selectedDate.year - 1 : selectedDate.year;
//                       setSelectedDate(prev => ({ ...prev, month: newMonth, year: newYear }));
//                     }}
//                     title={t("registration.datePicker.previousMonth")}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <polyline points="15,18 9,12 15,6"/>
//                     </svg>
//                   </button>
//                   <button
//                     type="button"
//                     className="date-picker__nav-btn date-picker__nav-btn--next"
//                     onClick={() => {
//                       const newMonth = selectedDate.month === 12 ? 1 : selectedDate.month + 1;
//                       const newYear = selectedDate.month === 12 ? selectedDate.year + 1 : selectedDate.year;
//                       if (isMonthSelectable(newMonth, newYear)) {
//                         setSelectedDate(prev => ({ ...prev, month: newMonth, year: newYear }));
//                       }
//                     }}
//                     title={t("registration.datePicker.nextMonth")}
//                   >
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <polyline points="9,18 15,12 9,6"/>
//                     </svg>
//                   </button>
//                 </>
//               )}
//               <button
//                 type="button"
//                 className="date-picker__nav-btn date-picker__nav-btn--view"
//                 onClick={() => {
//                   if (currentView === 'day') {
//                     setCurrentView('month');
//                   } else if (currentView === 'month') {
//                     setCurrentView('year');
//                   }
//                 }}
//                 title={t("registration.datePicker.selectYearMonth")}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
//                   <line x1="16" y1="2" x2="16" y2="6"/>
//                   <line x1="8" y1="2" x2="8" y2="6"/>
//                   <line x1="3" y1="10" x2="21" y2="10"/>
//                 </svg>
//               </button>
//               <button
//                 type="button"
//                 className="date-picker__close-btn"
//                 onClick={() => setIsOpen(false)}
//                 title={t("registration.datePicker.close")}
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <line x1="18" y1="6" x2="6" y2="18"/>
//                   <line x1="6" y1="6" x2="18" y2="18"/>
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="date-picker__content">
//             {currentView === 'year' && (
//               <div className="date-picker__years">
//                 <div className="date-picker__year-range">
//                   {getYearRange(selectedDate.year).map(year => {
//                     const isSelectable = isYearSelectable(year);
//                     return (
//                       <button
//                         key={year}
//                         type="button"
//                         className={`date-picker__year ${selectedDate.year === year ? 'date-picker__year--selected' : ''} ${!isSelectable ? 'date-picker__year--disabled' : ''}`}
//                         onClick={() => handleYearSelect(year)}
//                         disabled={!isSelectable}
//                       >
//                         {year}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <div className="date-picker__year-navigation">
//                   <button
//                     type="button"
//                     className="date-picker__nav-btn"
//                     onClick={() => setSelectedDate(prev => ({ ...prev, year: prev.year - 20 }))}
//                   >
//                     ← {t("registration.datePicker.previousYears", { count: 20 })}
//                   </button>
//                   <button
//                     type="button"
//                     className="date-picker__nav-btn"
//                     onClick={() => setSelectedDate(prev => ({ ...prev, year: prev.year + 20 }))}
//                   >
//                     {t("registration.datePicker.nextYears", { count: 20 })} →
//                   </button>
//                 </div>
//               </div>
//             )}

//             {currentView === 'month' && (
//               <div className="date-picker__months">
//                 <div className="date-picker__month-header">
//                   <h3 className="date-picker__month-title">{t("registration.datePicker.selectMonthFor", { year: selectedDate.year })}</h3>
//                 </div>
//                 <div className="date-picker__month-grid">
//                   {months.map(month => {
//                     const isSelectable = isMonthSelectable(month.value, selectedDate.year);
//                     return (
//                       <button
//                         key={month.value}
//                         type="button"
//                         className={`date-picker__month ${selectedDate.month === month.value ? 'date-picker__month--selected' : ''} ${!isSelectable ? 'date-picker__month--disabled' : ''}`}
//                         onClick={() => handleMonthSelect(month.value)}
//                         disabled={!isSelectable}
//                         title={isSelectable ? `${month.name} ${selectedDate.year}` : t("registration.datePicker.unavailable")}
//                       >
//                         <div className="date-picker__month-number">{month.value}</div>
//                         <div className="date-picker__month-name">{month.name}</div>
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   type="button"
//                   className="date-picker__back-btn"
//                   onClick={() => setCurrentView('year')}
//                 >
//                   ← {t("registration.datePicker.backToYears")}
//                 </button>
//               </div>
//             )}

//             {currentView === 'day' && (
//               <div className="date-picker__days">
//                 {/* Дни недели */}
//                 <div className="date-picker__weekdays">
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.monday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.monday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.tuesday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.tuesday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.wednesday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.wednesday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.thursday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.thursday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.friday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.friday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.saturday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.saturday.full")}</span>
//                   </div>
//                   <div className="date-picker__weekday">
//                     <span className="date-picker__weekday-short">{t("registration.datePicker.weekdays.sunday.short")}</span>
//                     <span className="date-picker__weekday-full">{t("registration.datePicker.weekdays.sunday.full")}</span>
//                   </div>
//                 </div>
                
//                 <div className="date-picker__days-grid">
//                   {/* Пустые ячейки для выравнивания */}
//                   {Array.from({ length: new Date(selectedDate.year, selectedDate.month - 1, 1).getDay() || 7 }).map((_, i) => (
//                     <div key={`empty-${i}`} className="date-picker__day date-picker__day--empty"></div>
//                   ))}
                  
//                   {days.map(day => {
//                     const isSelectable = isDaySelectable(day, selectedDate.month, selectedDate.year);
//                     const isHovered = hoveredDate?.day === day && hoveredDate?.month === selectedDate.month && hoveredDate?.year === selectedDate.year;
//                     const isToday = day === currentDay && selectedDate.month === currentMonth && selectedDate.year === currentYear;
                    
//                     return (
//                       <button
//                         key={day}
//                         type="button"
//                         className={`date-picker__day ${selectedDate.day === day ? 'date-picker__day--selected' : ''} ${!isSelectable ? 'date-picker__day--disabled' : ''} ${isToday ? 'date-picker__day--today' : ''} ${isHovered ? 'date-picker__day--hovered' : ''}`}
//                         onClick={() => handleDateSelect(day, selectedDate.month, selectedDate.year)}
//                         onMouseEnter={() => setHoveredDate({day, month: selectedDate.month, year: selectedDate.year})}
//                         onMouseLeave={() => setHoveredDate(null)}
//                         disabled={!isSelectable}
//                         title={isSelectable ? `${day} ${months[selectedDate.month - 1].name} ${selectedDate.year}` : t("registration.datePicker.unavailable")}
//                         aria-label={isSelectable ? `${day} ${months[selectedDate.month - 1].name} ${selectedDate.year}` : t("registration.datePicker.unavailable")}
//                         aria-pressed={selectedDate.day === day}
//                         role="button"
//                         tabIndex={isSelectable ? 0 : -1}
//                         style={{
//                           position: 'relative'
//                         }}
//                       >
//                         <div className="date-picker__day-content">
//                           <span className="date-picker__day-number">{day}</span>
//                           {isToday && (
//                             <span className="date-picker__day-today-indicator">{t("registration.datePicker.today")}</span>
//                           )}
//                           {selectedDate.day === day && (
//                             <div className="date-picker__selected-indicator" key={`indicator-${day}-${forceUpdate}`}>
//                               ✓
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
                
//                 <div className="date-picker__navigation">
//                   <button
//                     type="button"
//                     className="date-picker__back-btn"
//                     onClick={() => setCurrentView('month')}
//                   >
//                     ← {t("registration.datePicker.backToMonths")}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DatePicker;
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// --- Константы для колонок ---

// 1. Месяцы (значение 01-12 для YYYY-MM-DD)
const MONTHS_MAP: Record<string, string> = {
  '01': 'Января',
  '02': 'Февраля',
  '03': 'Марта',
  '04': 'Апреля',
  '05': 'Мая',
  '06': 'Июня',
  '07': 'Июля',
  '08': 'Августа',
  '09': 'Сентября',
  '10': 'Октября',
  '11': 'Ноября',
  '12': 'Декабря',
};

// 2. Дни
const DAYS = Array.from({ length: 31 }, (_, i) => {
  const day = String(i + 1);
  return day.padStart(2, '0'); // "1" -> "01"
});

// 3. Годы
const CURRENT_YEAR = new Date().getFullYear();
const MIN_AGE = 16; // Минимальный возраст
const MAX_YEAR = CURRENT_YEAR - MIN_AGE; // Самый "молодой" год
const MIN_YEAR = 1900; // Самый "старый" год

const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => 
  String(MAX_YEAR - i)
);
// --- Конец констант ---


interface DatePickerProps {
  // Принимает дату в формате "YYYY-MM-DD"
  value: string;
  // Отправляет дату в формате "YYYY-MM-DD"
  onChange: (date: string) => void;
}

// Вспомогательная функция для парсинга даты
const parseDate = (dateString: string): [string, string, string] => {
  if (dateString && dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Убедимся, что значения существуют в наших списках
      const year = YEARS.includes(parts[0]) ? parts[0] : String(MAX_YEAR);
      const month = MONTHS_MAP[parts[1]] ? parts[1] : '01';
      const day = DAYS.includes(parts[2]) ? parts[2] : '01';
      return [year, month, day];
    }
  }
  // Значения по умолчанию, если дата невалидна
  return [String(MAX_YEAR), '01', '01'];
};


export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  // Внутреннее состояние для каждой колонки
  const [year, setYear] = useState(String(MAX_YEAR));
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');

  // 1. Когда `value` из пропсов меняется, обновляем внутреннее состояние
  useEffect(() => {
    const [parsedYear, parsedMonth, parsedDay] = parseDate(value);
    setYear(parsedYear);
    setMonth(parsedMonth);
    setDay(parsedDay);
  }, [value]);

  // 2. Когда меняется любая из колонок, собираем новую дату и отправляем ее "наверх"
  const handleChange = (type: 'year' | 'month' | 'day', newValue: string) => {
    let newYear = year;
    let newMonth = month;
    let newDay = day;

    if (type === 'year') {
      newYear = newValue;
      setYear(newValue);
    } else if (type === 'month') {
      newMonth = newValue;
      setMonth(newValue);
    } else if (type === 'day') {
      newDay = newValue;
      setDay(newValue);
    }

    // Собираем дату в "YYYY-MM-DD"
    const newDateString = `${newYear}-${newMonth}-${newDay}`;
    onChange(newDateString);
  };

  return (
    <div className="custom-date-picker">
      {/* --- Колонка 1: ЧИСЛО --- */}
      <div className="picker-group">
        <label htmlFor="date-picker-day">{t('form.birthDate.day')}</label>
        <select
          id="date-picker-day"
          value={day}
          onChange={(e) => handleChange('day', e.target.value)}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* --- Колонка 2: МЕСЯЦ --- */}
      <div className="picker-group">
        <label htmlFor="date-picker-month">{t('form.birthDate.month')}</label>
        <select
          id="date-picker-month"
          value={month}
          onChange={(e) => handleChange('month', e.target.value)}
        >
          {Object.entries(MONTHS_MAP).map(([monthValue, monthName]) => (
            <option key={monthValue} value={monthValue}>
              {monthName}
            </option>
          ))}
        </select>
      </div>

      {/* --- Колонка 3: ГОД --- */}
      <div className="picker-group">
        <label htmlFor="date-picker-year">{t('form.birthDate.year')}</label>
        <select
          id="date-picker-year"
          value={year}
          onChange={(e) => handleChange('year', e.target.value)}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
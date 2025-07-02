
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface ActivityDateSelectorProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}

const presetOptions = [
  { label: "14 days", days: 14 },
  { label: "1 month", days: 30 },
  { label: "3 months", days: 90 },
  { label: "6 months", days: 180 },
  { label: "1 year", days: 365 },
];

export function ActivityDateSelector({ selectedDate, onDateChange }: ActivityDateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handlePresetSelect = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    onDateChange(date);
    setOpen(false);
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between text-left font-normal text-gray-900 hover:bg-gray-100 px-3 py-2 border-0"
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Last activity"}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 bg-white border border-gray-200 shadow-lg z-50" align="start" sideOffset={5}>
          {!showCalendar ? (
            <div className="flex">
              {/* Left side - Presets */}
              <div className="w-32 bg-gray-50 border-r border-gray-200">
                <div className="p-3 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Last activity</h4>
                </div>
                <div className="py-1">
                  {presetOptions.map((option) => (
                    <button
                      key={option.label}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => handlePresetSelect(option.days)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right side - Date inputs and calendar toggle */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start date</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={startDate ? format(startDate, "yyyy-MM-dd") : "2025-06-24"}
                        onChange={(e) => handleStartDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => setShowCalendar(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End date</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={endDate ? format(endDate, "yyyy-MM-dd") : "2025-06-24"}
                        onChange={(e) => handleEndDateChange(e.target.value ? new Date(e.target.value) : undefined)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => setShowCalendar(true)}
                        className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex">
              {/* Left side - Presets (same as above) */}
              <div className="w-32 bg-gray-50 border-r border-gray-200">
                <div className="p-3 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Last activity</h4>
                </div>
                <div className="py-1">
                  {presetOptions.map((option) => (
                    <button
                      key={option.label}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => handlePresetSelect(option.days)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right side - Calendar */}
              <div className="flex-1">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <button
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setShowCalendar(false)}
                  >
                    ← Back
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">June 2025</span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Custom calendar grid to match the design */}
                <div className="p-3">
                  <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                    <div className="py-1 font-medium text-gray-500">Wk</div>
                    <div className="py-1 font-medium text-gray-500">Mon</div>
                    <div className="py-1 font-medium text-gray-500">Tue</div>
                    <div className="py-1 font-medium text-gray-500">Wed</div>
                    <div className="py-1 font-medium text-gray-500">Thu</div>
                    <div className="py-1 font-medium text-gray-500">Fri</div>
                    <div className="py-1 font-medium text-gray-500">Sat</div>
                    <div className="py-1 font-medium text-gray-500">Sun</div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1 text-xs">
                    {/* Week numbers and dates - June 2025 */}
                    <div className="py-1 text-center text-gray-400">22</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">26</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">27</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">28</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">29</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">30</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">31</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">1</button>
                    
                    <div className="py-1 text-center text-gray-400">23</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">2</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">3</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">4</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">5</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">6</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">7</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">8</button>
                    
                    <div className="py-1 text-center text-gray-400">24</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">9</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">10</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">11</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">12</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">13</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">14</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">15</button>
                    
                    <div className="py-1 text-center text-gray-400">25</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">16</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">17</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">18</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">19</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">20</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">21</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">22</button>
                    
                    <div className="py-1 text-center text-gray-400">26</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">23</button>
                    <button className="py-1 text-center bg-blue-600 text-white rounded">24</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">25</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">26</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">27</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">28</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">29</button>
                    
                    <div className="py-1 text-center text-gray-400">27</div>
                    <button className="py-1 text-center hover:bg-blue-100 rounded">30</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">1</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">2</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">3</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">4</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">5</button>
                    <button className="py-1 text-center hover:bg-blue-100 rounded text-gray-400">6</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * Format a date to YYYY-MM-DD format
 */
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Check if a date string is valid
   */
  export const isValidDateString = (dateString: string): boolean => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  /**
   * Convert a date string to a Date object
   */
  export const parseDate = (dateString: string): Date | null => {
    if (!isValidDateString(dateString)) {
      return null;
    }
    return new Date(dateString);
  };
  
  /**
   * Get current date in YYYY-MM-DD format
   */
  export const getCurrentDate = (): string => {
    return formatDate(new Date());
  };
  
  /**
   * Add days to a date
   */
  export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  /**
   * Get date range: an array of dates between start and end
   */
  export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  };

import { BookingStatus } from 'helper/enum/booking_status.enum';

export class FilterBookingDto {
  page: string;

  itemsPerPage: string;

  search: string;

  maxPrice: string;

  minPrice: string;

  priceSort: string;

  startDate: string;

  endDate: string;

  is_confirm: boolean;

  is_deposit: boolean;

  status: BookingStatus;
}

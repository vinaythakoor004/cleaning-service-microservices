import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BookService } from '../service/book.service';
import { HomeService } from '../../../home/service/home.service';
import { serviceDetails } from '../model/serviceDetails';
import { bookingData } from '../../../home/model/bookingData';
import { AlertService } from '../../../common/service/alert/alert.service';
import { PopupService } from '../../../common/service/popup/popup.service';
import { LoaderService } from '../../../common/service/loader/loader.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-book-appointment',
  imports: [ MatDatepickerModule, CommonModule, MatTabsModule, ReactiveFormsModule, TranslatePipe ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
  providers: [provideNativeDateAdapter()],
})
export class BookAppointmentComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private bookService: BookService = inject(BookService);
  private homeService: HomeService = inject(HomeService);

  selectedDate: Date | null = null;
  timeSlots: Array<string> = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
  ];

  selectesService: serviceDetails = {
    id: 0,
    name: 'default',
    description: 'default',
    price: '0',
    time: 'default',
    servicedescription: 'default',
    contactDetails: 'default',
    image: 'default',
  };

  appointmentForm: FormGroup;
  selectedSlotIndex: number = -1;
  isDateInvalid: boolean = false;
  isSlotInvalid: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  );
  allBookingData: Array<bookingData> = [];

  constructor(private fb: FormBuilder, private loaderService: LoaderService, private alertService: AlertService, private popupService: PopupService) {
    this.appointmentForm = this.fb.group({
      selectedDate: ['', Validators.required],
      selectedSlot: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      message: [''],
    });
    this.minDate.setDate(this.minDate.getDate() - 0);
  }

  ngOnInit(): void {
    if (this.homeService.isEdit) {
      if (!this.bookService.serviceDetails.length) {
        this.bookService.getServiceDetails().subscribe({
          next: (data) => {
            if (!this.allBookingData.length) {
              this.allBookingData = this.homeService.allBookingDataCopy;
            }
            this.bookService.serviceDetails = data;
            this.setFormData(this.homeService.editItem);
          },
          error: (error) => {
            console.error('Error fetching service details:', error);
            this.bookService.serviceDetails = []; // Handle error case by setting services to an empty array
          }
        }
        );
      } else {
        this.setFormData(this.homeService.editItem);
        if (!this.allBookingData.length) {
          this.allBookingData = this.homeService.allBookingDataCopy;
        }
      }
    }else if (this.bookService.serviceDetails.length) {
      this.getServiceDetails();
      this.allBookingData = this.homeService.allBookingDataCopy;
    } else {
      this.router.navigate(['services']);
    }
  }

  getServiceDetails(): void {
    this?.activatedRoute?.queryParams?.subscribe((params) => {
      const serviceName = params['name'];
      this.selectesService =
        this.bookService.getServiceDetailsByName(serviceName);
    });
  }

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    this.selectedSlotIndex = -1; // Reset selected slot index when a new date is selected
    this.appointmentForm.patchValue({ selectedDate: date });
    this.appointmentForm.patchValue({ selectedSlot: '' });
    this.isDateInvalid = !this.appointmentForm.value.selectedDate;
    this.isSlotInvalid = !this.appointmentForm.value.selectedSlot;
  }

  selectSlot(slot: any, selectedIndex: number): void {
    this.selectedSlotIndex = selectedIndex;
    this.appointmentForm.patchValue({ selectedSlot: slot });
    this.isSlotInvalid = !this.appointmentForm.value.selectedSlot;
  }

  booAppontment(): void {
    console.log('Booking appointment...');
  }

  nextTab(formTab: any, btn: string): void {
    if (
      !this.appointmentForm.value.selectedDate ||
      !this.appointmentForm.value.selectedSlot
    ) {
      this.isDateInvalid = !this.appointmentForm.value.selectedDate;
      this.isSlotInvalid = !this.appointmentForm.value.selectedSlot;
      console.log('Please select a date and time slot before proceeding.');
    } else if (formTab && btn == 'next') {
      formTab.selectedIndex = formTab.selectedIndex + 1;
    } else if (formTab && btn == 'prev') {
      formTab.selectedIndex = formTab.selectedIndex - 1;
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointmentData: bookingData = {
        id: this.homeService.isEdit ? this.homeService.editItem.id : undefined,
        firstName: this.appointmentForm.value.firstName,
        lastName: this.appointmentForm.value.lastName,
        email: this.appointmentForm.value.email,
        phone: this.appointmentForm.value.phone,
        message: this.appointmentForm.value.message,
        country: 'USA',
        bookingDetails: {
          serviceName: this.selectesService.name,
          bookingDateTime: this.appointmentForm.value.selectedDate,
          address: this.selectesService.contactDetails,
          time: this.selectesService.time,
          price: this.selectesService.price,
          slot: this.appointmentForm.value.selectedSlot,
        },
      };
      const id = this.homeService.isEdit ? this.homeService?.editItem?.id || null : null;
      this.saveBooking(appointmentData, id);
      // this.homeService.bookingFormSubmitSubject.next(this.allBookingData);
      // console.log('Appointment booked successfully:', this.allBookingData);
      // Perform further actions with the appointment data, such as sending it to a server
    } else {
    }
  }

  saveBooking(appointmentData: bookingData, id?: string): void {
    this.loaderService.show();
    if (this.homeService.isEdit && id) {
      this.updateBookingData(appointmentData, id);
    } else {
      this.postBooking(appointmentData);
    }
  }

  postBooking(appointmentData: bookingData): void {
    this.homeService.postBooking(appointmentData)
    .pipe(
      finalize(() => {
      this.loaderService.hide();
    })
    ).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.openSnackBar('Appointment booked successfully!');
          this.homeService.isEdit = false;
          this.router.navigate(['home']);
        }
      },
      error: (err: any) => {
        this.alertService.openSnackBar('Appointment booking failed!');
      }
    })
  }

  updateBookingData(appointmentData: bookingData, id: string): void {
    this.homeService.updateBooking(appointmentData, id)
    .pipe(
      finalize(() => {
      this.loaderService.hide();
    })
    ).subscribe({
      next: (data: any) => {
        if (data) {
          this.alertService.openSnackBar('Appointment updated successfully!');
          this.homeService.isEdit = false;
          this.router.navigate(['home']);
        }
      },
      error: (err: any) => {
        this.alertService.openSnackBar('Appointment update failed!');
      }
    })
  }

  backBtnClick(): void {
    const data = {
      isCancelEdit: true
    }
    this.popupService.openDialog(data, '30rem', 'custom-dialog-container', () => {
      this.homeService.isEdit = false;
      this.homeService.editItem = {};
      this.router.navigate(['services/book-service'], {
        queryParams: { name: this.selectesService.name },
      });
      this.appointmentForm.reset();
    })
  }

  setFormData(item: bookingData): void {
    if (item) {
      this.appointmentForm.setValue({
        selectedDate: new Date(item.bookingDetails.bookingDateTime),
        selectedSlot: item.bookingDetails.slot || "",
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phone,
        message: item.message,
      });
      this.selectedDate = this.appointmentForm.value.selectedDate;
      this.selectedSlotIndex = this.timeSlots.findIndex(item => item === this.appointmentForm.value.selectedSlot);
      this.selectesService = this.bookService.getServiceDetailsByName(item.bookingDetails.serviceName);
    }
  }
}

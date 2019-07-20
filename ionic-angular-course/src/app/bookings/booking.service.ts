import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {Booking} from './booking.model';
import {delay, map, switchMap, take} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';
import {AuthService} from '../auth/auth.service';



@Injectable({providedIn: 'root'})
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        let generatedId: string;
        const newBooking = new Booking(
            null,
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this.http
            .post<Booking>(
                'http://127.0.0.1:8000/video/bookings/',
                { ...newBooking}
            )
            .pipe(
                switchMap(booking => {
                    generatedId = booking.id;
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    newBooking.id = generatedId;
                    this._bookings.next(bookings.concat(newBooking));
                })
            );
    }

    fetchBookings() {
        return this.http
            .get<{ [key: string]: Booking }>(
                `http://127.0.0.1:8000/video/bookings/`
            )
            .pipe(
                map(bookingData => {
                    const bookings = [];
                    for (const key in bookingData) {
                        if (bookingData.hasOwnProperty(key)) {
                            bookings.push(
                                new Booking(
                                    bookingData[key].id,
                                    bookingData[key].placeId,
                                    bookingData[key].userId,
                                    bookingData[key].placeTitle,
                                    bookingData[key].placeImage,
                                    bookingData[key].firstName,
                                    bookingData[key].lastName,
                                    bookingData[key].guestNumber,
                                    new Date(bookingData[key].bookedFrom),
                                    new Date(bookingData[key].bookedTo)
                                )
                            );
                        }
                    }
                    return bookings;
                }),
                tap(bookings => {
                    this._bookings.next(bookings);
                })
            );
    }

    cancelBooking(bookingId: string) {
        return this.http
            .delete(
                `http://127.0.0.1:8000/video/bookings/${bookingId}`
            )
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(bookings.filter(b => b.id !== bookingId));
                })
            );
    }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {delay, map, take} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators/tap';

import {Place} from './place.model';
import {AuthService} from '../auth/auth.service';
import {switchMap} from 'rxjs/internal/operators/switchMap';


// new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
// ),
//     new Place(
//         'p2',
//         'L\'Amour Toujours',
//         'A romantic place in Paris!',
//         'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Paris_Night.jpg/1024px-Paris_Night.jpg',
//         189.99,
//         new Date('2019-01-01'),
//         new Date('2019-12-31'),
//         'abc'
//     ),
//     new Place(
//         'p3',
//         'The Foggy Palace',
//         'Not your average city trip!',
//         'https://upload.wikimedia.org/wikipedia/commons/0/01/San_Francisco_with_two_bridges_and_the_fog.jpg',
//         99.99,
//         new Date('2019-01-01'),
//         new Date('2019-12-31'),
//         'abc'
//     )

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private _places = new BehaviorSubject<Place[]>([]);

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    get places() {
        return this._places.asObservable();
    }

    fetchPlaces() {
        return this.http
            .get<{ [key: string]: Place }>(
                'http://127.0.0.1:8000/video/places/'
            )
            .pipe(
                map(resData => {
                    const places = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(
                                new Place(
                                    resData[key].id,
                                    resData[key].title,
                                    resData[key].description,
                                    resData[key].imageUrl,
                                    resData[key].price,
                                    new Date(resData[key].availableFrom),
                                    new Date(resData[key].availableTo),
                                    resData[key].userId
                                )
                            );
                        }
                    }
                    return places;
                    // return [];
                }),
                tap(places => {
                    this._places.next(places);
                })
            );
    }

    getPlace(id: string) {
        return this.places.pipe(
            take(1),
            map(places => {
                return {...places.find(p => p.id === id)};
            })
        );
    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        // let newPlace: string;
        const newPlace = new Place(
            null,
            title,
            description,
            'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
            price,
            dateFrom,
            dateTo,
            this.authService.userId
        );
        // let newPlace = {
        //     id: null,
        //     userId: this.authService.userId,
        //     title: title,
        //     description: description,
        //     imageUrl: 'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
        //     price: price,
        //     availableFrom: dateFrom.toISOString().slice(0, 10),
        //     availableTo: dateTo.toISOString().slice(0, 10)
        // };
        return this.http
            .post<{ place: Place }>(
                'http://127.0.0.1:8000/video/places/',
                {
                    ...newPlace,
                    // id: null
                }
            )
            .pipe(
                switchMap(place => {
                    console.log(place);
                    return this.places;
                }),
                take(1),
                tap(places => {
                    // newPlace.id = generatedId;
                    this._places.next(places.concat(newPlace));
                })
            );
    }

    updatePlace(placeId: string, title: string, description: string) {
        return this.places.pipe(
            take(1),
            delay(1000),
            tap(places => {
                const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
                const updatedPlaces = [...places];
                const oldPlace = updatedPlaces[updatedPlaceIndex];
                updatedPlaces[updatedPlaceIndex] = new Place(
                    oldPlace.id,
                    title,
                    description,
                    oldPlace.imageUrl,
                    oldPlace.price,
                    oldPlace.availableFrom,
                    oldPlace.availableTo,
                    oldPlace.userId
                );
                this._places.next(updatedPlaces);
            })
        );
    }

}

import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
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
    // tslint:disable-next-line:variable-name
    private _places = new BehaviorSubject<Place[]>([]);
    // private serverIp = '13.52.101.191:8000';
    private serverIp = '127.0.0.1:8000';

    constructor(private authService: AuthService, private http: HttpClient) {
    }

    get places() {
        return this._places.asObservable();
    }

    fetchPlaces() {
        return this.http
            .get<{ [key: string]: Place }>(
                'http://' + this.serverIp + '/video/places/'
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
        return this.http
            .get<Place>(
               'http://' + this.serverIp + `/video/places/${id}/`
            )
            .pipe(
                map(placeData => {
                    return new Place(
                        id,
                        placeData.title,
                        placeData.description,
                        placeData.imageUrl,
                        placeData.price,
                        new Date(placeData.availableFrom),
                        new Date(placeData.availableTo),
                        placeData.userId
                    );
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
            .post<Place>(
                'http://' + this.serverIp + '/video/places/',
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
        let updatedPlaces: Place[];
        return this.places.pipe(
            take(1),
            switchMap(places => {
                if (!places || places.length <= 0) {
                    return this.fetchPlaces();
                } else {
                    return of(places);
                }
            }),
            switchMap(places => {
                // tslint:disable-next-line:triple-equals
                const updatedPlaceIndex = places.findIndex(pl => pl.id == placeId);
                updatedPlaces = [...places];
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
                return this.http.put(
                    'http://' + this.serverIp + `/video/places/${placeId}/`,
                    { ...updatedPlaces[updatedPlaceIndex], id: null }
                );
            }),
            tap(resData => {
                console.log(resData);
                this._places.next(updatedPlaces);
            })
        );
    }

}

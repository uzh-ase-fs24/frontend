import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { guess } from 'src/app/model/location-riddle';

enum Marker {
	USER,
	GUESS,
	SOLUTION
}

@Component({
	selector: 'app-map',
	styleUrls: ['./map.component.scss'],
	standalone: true,
	template: ` <div #mapElement class="map"></div> `
})
export class MapComponent {
	@ViewChild('mapElement') set content(mapElement: ElementRef) {
		this.initMap(mapElement);
	}

	center = input<Coordinate>();
	guesses = input<guess[]>([]);
	userGuess = input<Coordinate | null>();
	solution = input<Coordinate>();
	solved = input<boolean>(false);
	placeMarker = output<Coordinate>();

	map?: Map;
	defaultMapCenter = [914135.8295099558, 5901532.510434296]; // central of europe
	placedMarker?: Coordinate;

	private vectorSource = new VectorSource();
	private vectorLayer = new VectorLayer({
		source: this.vectorSource
	});

	constructor() {}

	initMap(mapElement: ElementRef) {
		this.map = new Map({
			target: mapElement.nativeElement,
			layers: [
				new TileLayer({
					source: new OSM()
				}),
				this.vectorLayer
			],
			controls: [],
			view: new View({
				center: this.center() || this.placedMarker || this.defaultMapCenter, // central of europe
				zoom: this.center() || this.placeMarker ? 4 : 16
			})
		});

		this.removeMapAttribution();

		this.guesses().forEach((guess) => {
			this.addMarker(guess.guess, Marker.GUESS, false);
		});

		this.addMarker(this.solution(), Marker.SOLUTION, false);

		if (!this.solved()) {
			this.map.on('click', (event) => {
				this.addMarker(event.coordinate, Marker.USER, true);
				this.placedMarker = event.coordinate;
			});
		}
	}

	addMarker(coordinate: Coordinate | undefined, markerType: Marker, emit = false) {
		if (!coordinate) return;
		if (emit) this.vectorSource.clear();

		const marker = new Feature({
			geometry: new Point(coordinate)
		});

		console.log(markerType);
		if (markerType === Marker.USER || markerType === Marker.SOLUTION) {
			marker.setStyle(
				new Style({
					image: new Icon({
						anchor: [0.5, 1],
						src:
							markerType === Marker.SOLUTION
								? 'assets/icons/location-sign-solution.svg'
								: 'assets/icons/location-sign.svg'
					})
				})
			);
		}

		this.vectorSource.addFeature(marker);
		if (emit) this.placeMarker.emit(coordinate);
	}

	removeMapAttribution() {
		const attribution = document.getElementsByClassName('ol-attribution');
		if (attribution.length > 0) {
			attribution[0].remove();
		}
	}
}

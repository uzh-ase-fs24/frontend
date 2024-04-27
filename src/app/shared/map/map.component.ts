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
import { Fill, Icon, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { Guess } from 'src/app/model/location-riddle';

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
	guesses = input<Guess[]>([]);
	userGuess = input<Coordinate | null>();
	solution = input<Coordinate>();
	solved = input<boolean>(false);
	marker = input<Coordinate | null>();
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
			this.addMarker(guess.guess, Marker.GUESS, guess.username, false);
		});

		this.addMarker(this.solution(), Marker.SOLUTION, 'Solution', false);
		this.addMarker(this.userGuess()!, Marker.USER, 'Your Guess', false);
		this.addMarker(this.marker()!, Marker.USER, '', true);

		if (!this.solved()) {
			this.map.on('click', (event) => {
				this.addMarker(event.coordinate, Marker.USER, '', true);
				this.placedMarker = event.coordinate;
			});
		}
	}

	public refreshMap() {
		setTimeout(() => {
			this.removeMapAttribution();

			this.guesses().forEach((guess) => {
				this.addMarker(guess.guess, Marker.GUESS, guess.username, false);
			});

			this.addMarker(this.solution(), Marker.SOLUTION, 'Solution', false);
		}, 800);
	}

	addMarker(coordinate: Coordinate | undefined, markerType: Marker, name: string, emit = false) {
		if (!coordinate) return;
		if (emit) this.vectorSource.clear();

		const marker = new Feature({
			geometry: new Point(coordinate)
		});

		if (markerType === Marker.USER || markerType === Marker.SOLUTION) {
			marker.setStyle(
				new Style({
					image: new Icon({
						anchor: [0.5, 1],
						src:
							markerType === Marker.SOLUTION
								? 'assets/icons/location-sign-solution.svg'
								: 'assets/icons/location-sign.svg'
					}),
					text: new Text({
						font: '12px Calibri,sans-serif',
						fill: new Fill({
							color: '#000'
						}),
						stroke: new Stroke({
							color: '#fff',
							width: 2
						}),
						offsetY: -36,
						text: name
					})
				})
			);
		} else {
			marker.setStyle(
				new Style({
					image: new CircleStyle({
						radius: 5,
						stroke: new Stroke({
							color: 'rgba(0, 0, 0)',
							width: 0.5
						}),
						fill: new Fill({
							color: 'rgba(66, 140, 255, 0.7)'
						})
					}),
					text: new Text({
						font: '12px Calibri,sans-serif',
						fill: new Fill({
							color: '#000'
						}),
						stroke: new Stroke({
							color: '#fff',
							width: 2
						}),
						offsetY: -12,
						text: name
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

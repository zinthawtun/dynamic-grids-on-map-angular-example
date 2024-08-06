import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import * as L from 'leaflet';
import * as d3 from 'd3';
import * as D from 'dynamic-grids-on-map';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TestingPro';
  private map: L.Map | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      
      this.initMap();
    }
  }

  private initMap(): void {
    this.map = D.produceMyMap({
      attribute_id: 'map',
      lat: 51.5074, lon: 0.1278,
      zoom: 10,

  });

  const tile1 = D.addMyTile({
      name: 'OpenStreetMap',
      link: 'http://openstreetmap.org',
      server_url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 18
  });

  tile1.addTo(this.map);

  //add an svg layer
  const svgLayer = D.addSVGLayer(); //
  if (this.map) {
    this.map.addLayer(svgLayer);
  }

  //select svg layer
  const g = D.selectSVGLayer({
      attribute_id: '#map',
      layer: 'svg',
      new_attribute: 'g'
  });

  //select color
  const color = d3.schemeCategory10;

    d3.csv('assets/london_demographics.csv').then((data) => {
      let markerList: L.Marker[] = [];  // to put dGrids into array

      data.forEach((d: any) => {
        d.LatLng = new L.LatLng(d.lat, d.lon);
        getMarker(d); // call this to create marker layer
      });

      function getMarker(d: any) {
        let marker = L.marker(d.LatLng);
        markerList.push(marker);
      }

      // Call dynamic grid API
      let dGrids = new D.DynamicGridsOnMap({
        map: this.map,
        gridSize: 80,
        M_data: markerList,
        delayRate: 1, // example value, adjust as needed
        customIconFun: (data: any) => {
          // example custom icon function, adjust as needed
          return L.icon({
            iconUrl: 'assets/pin.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
        }
      });

      dGrids.onAdd(this.map); // this will add the grid to the map

      if (this.map) {
        dGrids.addGrids(); // this will make the first grid on the screen
      }      
    });

    if (this.map) {
      L.control.layers({"OSM": tile1}, {
        "Leaflet Grid": D.originalGrid(),
      }).addTo(this.map);
    }
  }
}
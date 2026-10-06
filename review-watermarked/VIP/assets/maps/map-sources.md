# Area map: sources and coverage

Updated September 13, 2026. This map uses Leaflet 1.9.4 with key-free USGS The National Map topographic and aerial-imagery tiles. Directions open Google Maps separately. An internet connection is needed for Leaflet's CDN files and USGS background tiles; local place and traffic records are bundled as JavaScript so they can also load when the site is opened from a file.

## Property

8595 US Highway 51 N, Cobden, IL 62920. Address corroboration: a Shawnee Hills Wine Trail listing page for the current tenant (source S-15 in the site data, retrieved September 13, 2026). Property display coordinate: 37.584103852317, -89.237785809318. Street/access coordinate used for traffic matching: 37.583616444647, -89.235473828966. ArcGIS World Geocoder returned a score-100 PointAddress match. The pin is not a parcel polygon or survey.

Parcels (updated September 26, 2026, from the Union County assessor records, S-01/S-18 in the site data): the owner of record holds three parcels, 04-08-02-129-A5 (23.23 acres, with the lodge), 04-08-02-129-A6 (0.75 acres) and 04-08-02-143-B1 (3.16 acres), 27.14 acres in all. Listing sites still quote the retired parent numbers 129-A1, 129-A2 and 143-B from before a 2025 split; the adjacent parcel 129-A4 is not part of the offering. The listing gives 26.10 acres. Which parcels convey is to be confirmed in the contract. No parcel geometry service or survey is on file, so the map offers aerial imagery without drawing guessed boundaries. A surveyed boundary, assessor GIS export, GeoJSON, KML or shapefile can be added later.

Website 8 note: the page loads Leaflet only when the map section approaches the screen. If Leaflet or the USGS tiles cannot load, the page draws a static schematic from the same bundled coordinates and road records (no background imagery).

## Vehicle traffic

The bundled traffic-data.js contains 71 IDOT road segments selected by a 3,500-metre search radius around the property. The exact source query, retrieval date, attributes and geometry are stored in that file. Features intersecting the search circle can extend beyond it; the dashed circle indicates the search area, not a boundary of traffic activity. Panning outside the selection does not fetch more counts. Blank areas do not mean no traffic.

[IDOT current layer and field definitions](https://gis1.dot.illinois.gov/arcgis/rest/services/AdministrativeData/AADT/MapServer/0). Each colored road opens its own source record and reference year. The selection contains 2022 and 2025 records; it is not uniformly 2025. Geometry is generalized to 0.0001 degree and rounded to five decimal places for display, not engineering measurement.

The segment at the mapped access point is OBJECTID 44530, US 51: AADT 5,800 (2025); heavy commercial AADT 625 (2025), already included in the total. Adjacent US 51 segments repeat that volume and are not summed. Annual averages do not represent current congestion, unique customers, driveway visits, or a directional split.

Road colors use fixed vehicle/day bands: under 1,000 blue; 1,000–2,999 ochre; 3,000–5,999 orange; 6,000 and above red. This is a road-volume heat view, not a continuous density estimate over unmeasured land. The displayed property point is west of the highway; the road data were matched at its mapped street access coordinate.

## Pedestrians and visits

No reliable public pedestrian or property-visitor count was located. The Foot traffic view explains the gap; its overlay checkbox is disabled. No synthetic pedestrian heat layer is generated.

## Destination pins

Concept assignments are editorial relevance choices, not endorsements, partnerships, evidence of demand, or promises of availability. The Events & weddings layer now includes every unique provider retained in the on-page wedding directory. Duplicate appearances across categories are combined into one resource entry.

| Place | Address/coordinate source | Coordinate method |
|---|---|---|
| Cristaudo's Café & Bakery | https://www.cristaudos.com/info | ArcGIS score-100 PointAddress match for 209 S Illinois Ave, Carbondale |
| Davie School Inn | https://www.davieschoolinn.com/ContactUs/ | ArcGIS score-100 PointAddress match for 300 Freeman St, Anna |
| Giant City State Park | https://dnr.illinois.gov/parks/park.giantcity.html | DNR's published park point: 37.602, -89.189 |
| Southern Illinois University Carbondale | https://siu.edu/contact-us/ | ArcGIS score-100 PointAddress match for 1263 Lincoln Drive, Carbondale; contact location, not campus centroid |
| StarView Vineyards | https://shawneewinetrail.com/starview-vineyards/ | ArcGIS score-100 PointAddress match for 5100 Wing Hill Rd, Cobden |

Twenty-one additional street addresses from the research were matched through the ArcGIS World Geocoding service on September 13, 2026; the map labels these as address matches that still require current-location verification. Providers for which the research names only a city, region, or mobile service area are shown with dashed ochre markers distributed around an approximate city/service-area reference. Those approximate markers are orientation aids, not storefront coordinates. Their links open a business-name map search instead of point-to-point directions.

## Maintenance

Edit places-data.js to add source-verified destinations and their relevant concept indexes (0 weddings, 1 retreats, 2 restaurant, 3 outdoor, 4 community, 5 adaptive reuse). Recheck sources before adding pins. Refresh traffic-data.js from IDOT's query and preserve source/year fields; IDs may change. Never substitute traffic speed for volume.

USGS attribution must remain visible. Background tiles are requested on demand with normal browser caching, no prefetch or offline download. The Standard view uses `USGSTopo`; Satellite / aerial uses `USGSImageryOnly`. Both were verified at the property location on September 13, 2026. USGS describes the imagery-only basemap as cached orthoimagery: https://www.usgs.gov/faqs/what-are-urls-imagery-services-national-map-and-are-they-cached-or-dynamic. Service directory: https://apps.nationalmap.gov/services/. Leaflet documentation: https://leafletjs.com/reference.html.

No accounts, paid API services, advertising data subscriptions, or public deployment were created for this update.

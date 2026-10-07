(() => {
  'use strict';
  const section = document.getElementById('location-map');
  if (!section) return;
  const before = document.getElementById('decision-center');
  if (before) before.before(section);
  const nav = document.querySelector('.nav-links');
  if (nav && !nav.querySelector('[href="#location-map"]')) {
    const link = document.createElement('a'); link.href = '#location-map'; link.textContent = 'Area map';
    nav.insertBefore(link, nav.querySelector('[href="#gallery"]'));
  }
  const q = id => document.getElementById(id);
  const element = (tag, text, cls) => { const e=document.createElement(tag); if(text)e.textContent=text;if(cls)e.className=cls;return e; };
  const external = (text, href) => {const a=element('a',text);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;};
  const data = window.PROPERTY_PLACES;
  const traffic = window.PROPERTY_TRAFFIC;
  const names = ['Events & weddings','Retreats & hospitality','Restaurant & catering','Outdoor recreation','Community & nonprofit','Adaptive reuse'];
  const conceptSelect=q('map-concept'), categorySelect=q('map-category');
  names.forEach((name,i)=>{const o=element('option',name);o.value=String(i);conceptSelect.append(o);});
  let concept=typeof selectedConcept==='number'?selectedConcept:0;
  let map, placesLayer, trafficLayer, propertyMarker, footprint, baseLayer;
  const baseLayers={};
  const markers=new Map();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const directions=p=>'https://www.google.com/maps/'+(p.locationPrecision==='service-area'?'search/?api=1&query=':'dir/?api=1&destination=')+encodeURIComponent(p.locationPrecision==='service-area'?p.name+' '+p.address:p.address);
  const sourceUrl=id=>'https://gis1.dot.illinois.gov/arcgis/rest/services/AdministrativeData/AADT/MapServer/0/query?objectIds='+encodeURIComponent(id)+'&outFields=*&returnGeometry=false&f=pjson';
  const roadName=p=>(p.MARKED_NAM||'').trim()==='U051'?'US Highway 51':((p.ROAD_NAME||'').trim()||(p.MARKED_NAM||'').trim()||'Local road');
  const format=n=>Number(n).toLocaleString('en-US');
  const validTraffic=f=>Number.isFinite(f.properties.AADT)&&f.properties.AADT>0&&f.properties.AADT_YR>0;
  const color=n=>n<1000?'#216fa5':n<3000?'#ba840c':n<6000?'#e66525':'#b32940';
  function notifyError(text){q('map-load-error').hidden=false;q('map-load-error').textContent=text;}
  function propertyDetails(){
    const box=q('map-details');box.replaceChildren();
    box.append(element('p',data.property.address,'map-small'));
    [['5,800','vehicles/day · US 51 · 2025'],['625','heavy commercial vehicles/day · included in total']].forEach(([v,l])=>{const d=element('div',null,'map-stat');d.append(element('strong',v),element('span',l));box.append(d);});
    box.append(element('p','IDOT annual averages at the mapped access location. These are road volumes, not property visits.','map-small'));
    box.append(external('View IDOT source',sourceUrl(44530)));
  }
  function popupPlace(p, reference){
    const box=element('div',null,'property-map-popup');
    if(reference)box.append(element('span','#'+reference,'map-popup-ref'));
    box.append(element('strong',p.name),element('p',p.address));
    if(p.note)box.append(element('p',p.note));
    if(p.positionNote)box.append(element('p',p.positionNote,'map-position-note'));
    box.append(external(p.locationPrecision==='service-area'?'Search map ↗':'Directions ↗',directions(p)));
    if(p.source)box.append(external('Source ↗',p.source));
    return box;
  }
  function popupRoad(p){
    const box=element('div',null,'property-map-popup');box.append(element('strong',roadName(p)),element('p',format(p.AADT)+' vehicles/day · '+p.AADT_YR+' AADT'));
    if(p.HCV_AADTYR>0&&p.HCV_AADT>0)box.append(element('p',format(p.HCV_AADT)+' heavy commercial vehicles/day ('+p.HCV_AADTYR+'), included in total.'));
    box.append(element('p','Published roadway average, not live congestion or unique visitors.'),external('IDOT record ↗',sourceUrl(p.OBJECTID)));return box;
  }
  function categories(){
    categorySelect.replaceChildren();const all=element('option','All categories');all.value='all';categorySelect.append(all);
    [...new Set(data.places.filter(p=>p.concepts.includes(concept)).map(p=>p.category))].sort().forEach(c=>{const o=element('option',c);o.value=c;categorySelect.append(o);});
  }
  function filteredPlaces(){return data.places.filter(p=>p.concepts.includes(concept)&&(categorySelect.value==='all'||p.category===categorySelect.value));}
  function placeDetails(){
    const box=q('map-details');box.replaceChildren();const shown=filteredPlaces();
    box.append(element('p','Map numbers match the numbered directory below. Select any item to locate it.','map-list-guide'));
    const list=element('ol',null,'map-place-list');
    shown.forEach((p,i)=>{
      const li=element('li');const b=element('button',p.name);b.type='button';b.disabled=!map;
      li.dataset.placeId=p.id;
      b.onclick=()=>{map.setView([p.lat,p.lng],p.locationPrecision==='service-area'?11:14,{animate:!reduced});markers.get(p.id)?.openPopup();highlightPlace(p.id);q('property-map-canvas').focus({preventScroll:true});};
      const copy=element('div',null,'map-place-copy');copy.append(b,element('small',p.category),element('small',p.address));
      if(p.locationPrecision==='service-area')copy.append(element('small','Approximate service area','map-location-quality'));
      copy.append(external(p.locationPrecision==='service-area'?'Search map':'Directions',directions(p)));
      if(p.source)copy.append(external('Source',p.source));
      li.append(element('span',String(i+1),'map-list-ref'),copy);list.append(li);
    });
    box.append(list);
    if(concept===0)box.append(external('Full wedding research directory','assets/research/local-wedding-network-research.md'));
  }
  function highlightPlace(id){q('map-details').querySelectorAll('.map-place-list li').forEach(li=>li.classList.toggle('is-active',li.dataset.placeId===id));}
  function renderLayers(fit=false){
    const area=q('map-places-toggle').checked, cars=q('map-traffic-toggle').checked;
    q('map-category-control').hidden=!area;q('map-traffic-legend').hidden=!cars;
    q('map-detail-title').textContent=area?names[concept]:'8595 US Highway 51 N';
    q('map-status').textContent=area?filteredPlaces().length+' mapped nearby resources'+(cars?' · vehicle traffic on':''):cars?'US 51 frontage · 2025 annual averages':'Cobden, Illinois · Property location';
    if(area)placeDetails();else propertyDetails();
    q('map-context').textContent=cars?'Color follows measured road segments in a local IDOT selection around the property. Repeated road segments are not additional traffic.':area?'Solid markers use sourced street addresses or published destination coordinates. Dashed ochre markers are approximate city or service-area references, not storefront locations.':'Property pin is a mapped location, not a surveyed boundary.';
    if(map){
      placesLayer.clearLayers();markers.clear();
      if(area)filteredPlaces().forEach((p,i)=>{
        const m=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'map-marker'+(p.locationPrecision==='service-area'?' approximate':''),html:'<span>'+(i+1)+'</span>',iconSize:[30,30],iconAnchor:[15,15]}),title:(i+1)+'. '+p.name,alt:(i+1)+'. '+p.name,keyboard:true})
          .bindPopup(popupPlace(p,i+1)).bindTooltip((i+1)+'. '+p.name,{direction:'top',offset:[0,-12],opacity:.96}).addTo(placesLayer);
        m.on('click',()=>highlightPlace(p.id));markers.set(p.id,m);
      });
      if(cars){if(!map.hasLayer(trafficLayer))trafficLayer.addTo(map);if(!map.hasLayer(footprint))footprint.addTo(map);}
      else{map.removeLayer(trafficLayer);map.removeLayer(footprint);}
      if(fit)fitLayers();
    }
  }
  function fitLayers(){
    if(!map)return;
    const pts=[[data.property.lat,data.property.lng]];
    if(q('map-places-toggle').checked)filteredPlaces().forEach(p=>pts.push([p.lat,p.lng]));
    if(q('map-traffic-toggle').checked)pts.push([37.551,-89.279],[37.617,-89.197]);
    if(pts.length===1)map.setView(pts[0],15,{animate:!reduced});else map.fitBounds(pts,{padding:[32,32],maxZoom:14,animate:!reduced});
  }
  function syncConcept(index){concept=index;conceptSelect.value=String(index);categories();renderLayers(q('map-places-toggle').checked);}
  if(typeof selectConcept==='function'){
    const previousSelect=selectConcept;
    selectConcept=function(index){previousSelect(index);syncConcept(index);};
  }
  conceptSelect.onchange=()=>{
    const index=Number(conceptSelect.value);
    if(typeof selectConcept==='function')selectConcept(index);else syncConcept(index);
    q('map-places-toggle').checked=true;
    renderLayers(true);
  };
  categorySelect.onchange=()=>renderLayers(true);
  ['map-places-toggle','map-traffic-toggle'].forEach(id=>q(id).onchange=()=>renderLayers(true));
  section.querySelectorAll('input[name="map-style"]').forEach(input=>input.onchange=()=>{
    if(!map||!input.checked)return;
    if(baseLayer)map.removeLayer(baseLayer);
    baseLayer=baseLayers[input.value];
    baseLayer.addTo(map);
    baseLayer.bringToBack();
    q('map-context').textContent=input.value==='satellite'?'Aerial imagery provides visual context. The property pin is mapped, and no unverified property boundary is drawn.':'Standard map shown with the selected data layers.';
  });
  q('map-reset').onclick=fitLayers;
  if(!data){notifyError('Place data could not load. Use the property directions link.');return;}
  conceptSelect.value=String(concept);categories();propertyDetails();
  function initialize(){
    if(map)return;
    if(!window.L){notifyError('The interactive map could not load. Check your internet connection and reload. Place sources and directions remain available.');q('property-map-canvas').replaceChildren(element('p','Map unavailable. Use the directions and place links.','map-loading'));renderLayers();return;}
    q('property-map-canvas').replaceChildren();
    map=L.map('property-map-canvas',{scrollWheelZoom:false,zoomAnimation:!reduced,fadeAnimation:!reduced}).setView([data.property.lat,data.property.lng],15);
    q('property-map-canvas').tabIndex=0;
    const tileOptions={maxNativeZoom:16,maxZoom:18,attribution:'Map and imagery: <a href="https://www.usgs.gov/programs/national-geospatial-program/national-map" target="_blank" rel="noopener">USGS The National Map</a>'};
    baseLayers.standard=L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',tileOptions);
    baseLayers.satellite=L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',tileOptions);
    baseLayer=baseLayers[section.querySelector('input[name="map-style"]:checked')?.value||'standard'].addTo(map);
    let failures=0;
    Object.values(baseLayers).forEach(tiles=>{
      tiles.on('tileerror',()=>{if(++failures>=3)notifyError('Some background map tiles could not load. Pins and sourced road data are still available.');});
      tiles.on('load',()=>{failures=0;q('map-load-error').hidden=true;});
    });
    propertyMarker=L.marker([data.property.lat,data.property.lng],{icon:L.divIcon({className:'map-marker property-pin',html:'<span>P</span>',iconSize:[38,38],iconAnchor:[19,19]}),title:'The property · 8595 US Highway 51 N',alt:'Property location',zIndexOffset:1000}).bindPopup(popupPlace(data.property)).addTo(map);
    placesLayer=L.layerGroup().addTo(map);
    const usable=traffic?.features?.filter(validTraffic)||[];
    // The buffer is query coverage, never a parcel boundary or inferred traffic surface.
    footprint=L.circle([data.property.lat,data.property.lng],{radius:3500,fill:false,color:'#576b61',weight:1,dashArray:'5 7',interactive:false});
    trafficLayer=L.geoJSON({type:'FeatureCollection',features:usable},{style:f=>({color:color(f.properties.AADT),weight:6,opacity:.85,lineCap:'round'}),onEachFeature:(f,layer)=>{layer.bindPopup(popupRoad(f.properties));layer.on('mouseover',()=>layer.setStyle({weight:10}));layer.on('mouseout',()=>layer.setStyle({weight:6}));}});
    if(!usable.length){q('map-traffic-toggle').disabled=true;section.querySelector('[data-map-view="traffic"]').disabled=true;notifyError('Traffic geometry could not load. The verified US 51 count is listed in the property summary.');}
    L.control.scale({imperial:true,metric:true}).addTo(map);
    renderLayers(true);
    if(window.ResizeObserver)new ResizeObserver(()=>map.invalidateSize({pan:false})).observe(q('property-map-canvas'));
  }
  // Avoid requesting background tiles until the visitor reaches the map.
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();initialize();}},{rootMargin:'250px'});observer.observe(section);}
  else initialize();
})();

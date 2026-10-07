// Public source addresses checked 2026-09-13. Coordinates are address matches,
// not surveyed boundaries. Concept associations are editorial research choices.
window.PROPERTY_PLACES = {
  retrieved: '2026-09-13',
  property: {lat:37.584103852317,lng:-89.237785809318,name:'8595 US Highway 51 N',address:'8595 US Highway 51 N, Cobden, IL 62920'},
  places: [
    {id:'cristaudos',name:"Cristaudo’s Café & Bakery",category:'Food & catering',lat:37.725751,lng:-89.216523,address:'209 S Illinois Ave, Carbondale, IL 62901',concepts:[0,1,2,4],note:'Café, bakery and catering; a regional food-service reference.',source:'https://www.cristaudos.com/info',positionNote:'Address geocode; score 100, PointAddress.'},
    {id:'davie',name:'Davie School Inn',category:'Guest lodging',lat:37.457562,lng:-89.247125,address:'300 Freeman St, Anna, IL 62906',concepts:[0,1,2,3,5],note:'Guest lodging in Anna; an example of school-building reuse.',source:'https://www.davieschoolinn.com/ContactUs/',positionNote:'Address geocode; score 100, PointAddress.'},
    {id:'giant-city',name:'Giant City State Park',category:'Outdoors & recreation',lat:37.602,lng:-89.189,address:'235 Giant City Road, Makanda, IL 62958',concepts:[0,1,2,3,4,5],note:'Hiking, camping and regional outdoor recreation. Pin is the park location published by Illinois DNR.',source:'https://dnr.illinois.gov/parks/park.giantcity.html',positionNote:'Coordinates published by Illinois DNR; park reference point.'},
    {id:'siu',name:'Southern Illinois University Carbondale',category:'Education & community',lat:37.714327,lng:-89.217538,address:'1263 Lincoln Drive, Carbondale, IL 62901',concepts:[1,2,3,4,5],note:'Regional university. Pin marks the published contact address; no relationship with the property is implied.',source:'https://siu.edu/contact-us/',positionNote:'Address geocode; score 100, PointAddress.'},
    {id:'starview',name:'StarView Vineyards',category:'Wine trail & dining',lat:37.529800,lng:-89.165522,address:'5100 Wing Hill Rd, Cobden, IL 62920',concepts:[0,1,2,3,5],note:'Nearby wine-trail destination; useful regional hospitality context.',source:'https://shawneewinetrail.com/starview-vineyards/',positionNote:'Address geocode; score 100, PointAddress.'}
  ],
  services: [
    {name:'KFS Events',category:'Rentals & event support',concepts:[0,1,4],note:'Southern Illinois tents, tables, chairs and event rentals. Service-area listing; no verified street pin added.',source:'https://kfsevents.com/'},
    {name:'A Splendid Affair',category:'Florals & event design',concepts:[0],note:'Carterville wedding floral and event-design business. Street location requires confirmation before pinning.',source:'https://www.splendideventdesign.com/'},
    {name:'Backroads Photography by Mandy Daly',category:'Photography',concepts:[0],note:'Service-area provider in the supplied wedding research; location not independently verified.',source:'https://www.mandydaly.net/'},
    {name:'Polished Makeup & Hair',category:'Hair & makeup',concepts:[0],note:'Mobile service in the supplied wedding research; location not independently verified.',source:'https://polishedmakeupandhair.com/'}
  ]
};

// Complete Events & weddings directory. Exact street addresses use matched
// coordinates; city/service-area entries are deliberately approximate and are
// labeled that way in the map instead of being presented as storefronts.
(() => {
  const data = window.PROPERTY_PLACES;
  const exactRows = [
    ['naomi-ariel','Naomi Ariel Catering and Event Planner','Catering',37.725093,-89.217152,'205 W Walnut St, Carbondale, IL 62901',''],
    ['big-nates',"Big Nate’s BBQ",'Catering',37.729274,-89.234678,'1206 W Linden St, Carbondale, IL 62901',''],
    ['larrys-cakes',"Larry’s House of Cakes",'Cakes & bakeries',37.728144,-89.239671,'1807 W Main St, Carbondale, IL 62901',''],
    ['kozy-cakes','Kozy Cakes','Cakes & bakeries',37.741938,-89.162296,'2355 Sweets Dr, Suite C, Carbondale, IL 62902','https://www.kozycakes.com'],
    ['mjs-place',"MJ’s Place",'Florals & event design',37.723726,-89.283405,'104 Hidden Trace Rd, Carbondale, IL 62901','https://mjzdesigngroup.wixsite.com/mysite'],
    ['schnucks-floral','Schnucks Floral – Carbondale','Florals & event design',37.725241,-89.228949,'915 W Main St, Carbondale, IL 62901',''],
    ['splendid-affair','A Splendid Affair / The Barefoot Florist','Florals & event design',37.758052,-89.077499,'403 S Division St, Suite A, Carterville, IL 62918','https://www.splendideventdesign.com'],
    ['white-oak-films','White Oak Wedding Films','Videography',37.731860,-88.926264,'118 E Union St, Marion, IL 62959',''],
    ['fritzler-films','Fritzler Wedding Films','Videography',37.321589,-89.557722,'1021 Kingsway Dr, Suite 6, Cape Girardeau, MO 63701',''],
    ['empire-entertainment','Empire Entertainment','Videography',38.003118,-88.907568,'609 N 8th St, Benton, IL 62812',''],
    ['officiant-monica','Wedding Officiant Monica','Planning & officiants',37.765768,-89.116588,'200 Paradise Acres Rd, Carterville, IL 62918',''],
    ['clique','Clique','Hair & makeup',37.741142,-88.925645,'114 E Deyoung St, Marion, IL 62959',''],
    ['jodi-duncan','Jodi Duncan Designs','Florals & event design',37.980346,-88.329085,'112 S Division St, Norris City, IL 62869',''],
    ['at-home-duncan','At Home With J Duncan','Florals & event design',37.738097,-88.534485,'521 E Poplar St, Harrisburg, IL 62946',''],
    ['kfs-events','KFS Events','Rentals & event support',37.833695,-89.027388,'101 Chittyville Rd, Herrin, IL 62948','https://kfsevents.com/'],
    ['tims-photo-booth',"Tim’s Photo Booth Services",'Entertainment & photo booths',37.760484,-89.250957,'281 Glenn Rd, Murphysboro, IL 62966',''],
    ['my-michelles',"My Michelle’s Photography & Photo Booth",'Entertainment & photo booths',37.804951,-89.027889,'213 N Park Ave, Herrin, IL 62948',''],
    ['diamond-limo','Diamond Limo and Party Bus','Transportation',37.814861,-89.019218,'1300 N 8th St, Herrin, IL 62948',''],
    ['shawnee-hill','Shawnee Hill Bed and Breakfast','Guest lodging',37.543079,-89.214859,'290 Water Valley Rd, Cobden, IL 62920',''],
    ['boars-nest',"Boar’s Nest Bed & Breakfast",'Guest lodging',37.474346,-89.272049,'1304 Kratzinger Hollow Rd, Cobden, IL 62920',''],
    ['wine-country-cottage','Wine Country Cottage','Guest lodging',37.581125,-89.139453,'6525 Water Valley Rd, Cobden, IL 62920','']
  ];
  const centers = {carbondale:[37.7273,-89.2168],marion:[37.7306,-88.9331],southernIllinois:[37.675,-89.105],cobden:[37.5314,-89.2534],woodlawn:[38.3303,-89.0334],hurst:[37.8331,-89.1429],stLouis:[38.627,-90.1994]};
  const areaRows = [
    ['into-fire','Into the Fire Catering','Catering','carbondale','Carbondale, IL 62901',''],
    ['cutting-edge','Cutting Edge Catering & Eatery','Catering','carbondale','Carbondale area',''],
    ['one-hot-cookie','One Hot Cookie Bakery & Catering','Cakes & bakeries','carbondale','Carbondale area',''],
    ['allys-bake-shop',"Ally’s Bake Shop",'Cakes & bakeries','carbondale','Carbondale area',''],
    ['wedding-bug','The Wedding Bug','Planning & officiants','carbondale','Carbondale, IL 62901',''],
    ['les-marie','Les Marie Florist and Gifts','Florals & event design','carbondale','Carbondale area',''],
    ['backroads-photo','Backroads Photography by Mandy Daly','Photography','southernIllinois','Serving Southern Illinois','https://www.mandydaly.net/'],
    ['crabtree-photo','Crabtree Photo Lab','Photography','southernIllinois','Serving Marion, Carbondale and Cape Girardeau','https://www.crabtreephotolab.com/'],
    ['savanna-photo','Savanna Kathleen Photography','Photography','southernIllinois','Serving Southern Illinois','https://www.savannakathleenphotography.com/'],
    ['kirstan-brooke','Kirstan Brooke Photo & Film','Videography','carbondale','Carbondale area',''],
    ['spectrum-sound','Spectrum Sound','Entertainment & photo booths','southernIllinois','Serving Southern Indiana, Illinois and Western Kentucky','https://spectrumsound.com/'],
    ['jd-entertainment','DJ_jdentertainment','Entertainment & photo booths','carbondale','Carbondale, IL 62901',''],
    ['mobile-music','Mobile Music Providers','Entertainment & photo booths','carbondale','Carbondale, IL 62901',''],
    ['rbr-dj','RBR DJ & Sound','Entertainment & photo booths','carbondale','Carbondale area',''],
    ['memory-lane-music','Memory Lane Music Service','Entertainment & photo booths','carbondale','Carbondale area',''],
    ['deep-house','Deep House Entertainment','Entertainment & photo booths','stLouis','St. Louis service area',''],
    ['god-squad','God Squad Ministers','Planning & officiants','carbondale','Carbondale service area',''],
    ['monica-hantz','Wedding Officiant Monica Hantz','Planning & officiants','marion','Marion, IL 62959',''],
    ['karma-smith','Karma Smith – Secular Wedding Officiant','Planning & officiants','carbondale','Carbondale service area',''],
    ['lees-mobile',"Lee’s Mobile Weddings",'Planning & officiants','southernIllinois','Southern Illinois service area',''],
    ['polished','Polished Makeup & Hair','Hair & makeup','southernIllinois','Southern Illinois mobile service','https://polishedmakeupandhair.com/'],
    ['fringe-salon','Fringe the Salon','Hair & makeup','carbondale','Carbondale, IL',''],
    ['haute-mess','Haute Mess Express','Hair & makeup','carbondale','Carbondale, IL 62901',''],
    ['white-house-salon','White House Salon','Hair & makeup','carbondale','Carbondale area',''],
    ['create-scene','Create A Scene Events','Florals & event design','southernIllinois','Southern Illinois service area','https://createasceneevents.com/'],
    ['all-blown-up','All Blown Up Event Rentals','Rentals & event support','carbondale','Carbondale service area','https://allblownupinflatables.com/'],
    ['arwood','Arwood Site Services','Rentals & event support','carbondale','Carbondale service area','https://arwoodsiteservices.com/'],
    ['cp-rentals','C&P Event Rentals and Such','Rentals & event support','woodlawn','Woodlawn, IL 62898',''],
    ['pics-photo-booth','Pics Photo Booth','Entertainment & photo booths','carbondale','Serving Carbondale and the Tri-State area','https://picsphotobooth.com/'],
    ['anywhere-limo','Anywhere Limo','Transportation','carbondale','Carbondale service area','https://www.anywherelimo.com/'],
    ['venturing-out','Venturing Out','Transportation','hurst','Hurst, IL 62949',''],
    ['global-limos','Global Limos','Transportation','carbondale','Carbondale service area','https://www.globallimos.com/'],
    ['ramz-limo','Ramz Limo','Transportation','carbondale','Carbondale service area','https://ramzlimo.com/'],
    ['pink-party-buses','Pink Party Buses','Transportation','carbondale','Carbondale service area','http://www.pinkpartybuses.com/'],
    ['unlimited-charters','Unlimited Charters','Transportation','carbondale','Carbondale service area','https://unlimitedcharters.com/'],
    ['hotel-7-anna','Hotel 7 Inn Anna','Guest lodging','cobden','Anna, IL',''],
    ['hampton-carbondale','Hampton Inn Carbondale','Guest lodging','carbondale','Carbondale, IL',''],
    ['best-western-saluki','Best Western Saluki Inn','Guest lodging','carbondale','Carbondale, IL',''],
    ['best-western-marion','Best Western Marion Hotel','Guest lodging','marion','Marion, IL',''],
    ['drury-marion','Drury Inn & Suites Marion','Guest lodging','marion','Marion, IL',''],
    ['fairfield-marion','Fairfield by Marriott Inn & Suites Marion','Guest lodging','marion','Marion, IL','']
  ];
  exactRows.forEach(([id,name,category,lat,lng,address,source])=>data.places.push({id,name,category,lat,lng,address,source,concepts:[0],locationPrecision:'address',positionNote:'Street-address match; verify the current business location before relying on it.'}));
  areaRows.forEach(([id,name,category,key,address,source],index)=>{const center=centers[key],angle=(index*137.508)*Math.PI/180,radius=.010+(index%5)*.0045;data.places.push({id,name,category,address,source,concepts:[0],lat:center[0]+Math.sin(angle)*radius,lng:center[1]+Math.cos(angle)*radius,locationPrecision:'service-area',positionNote:'Approximate service-area reference, not a verified storefront location.'});});
})();
